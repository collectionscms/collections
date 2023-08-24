import { pick } from '../../utilities/pick.js';
import { CollectionOverview, FieldOverview } from '../database/overview.js';
import { PrimaryKey } from '../database/schemas.js';
import { FieldFilter, Query } from '../database/types.js';
import { AbstractServiceOptions, BaseService } from './base.js';

export class ContentsService extends BaseService<any> {
  constructor(collection: string, options: AbstractServiceOptions) {
    super(collection, options);
  }

  /**
   * @description Read contents, including related contents
   * @param query
   * @returns contents
   */
  async getContents(
    appAccess: boolean,
    collection: CollectionOverview,
    key?: PrimaryKey
  ): Promise<any[]> {
    const query = this.makeQuery(appAccess, collection, key);
    const contents = await this.readMany(query);

    const children: Record<string, { relatedField: string; data: any }> = {};

    const aliasFields = Object.values(this.schema.collections[this.collection].fields).filter(
      (field) => field.alias
    );

    // /////////////////////////////////////
    // Alias fields
    // /////////////////////////////////////
    for (let field of aliasFields) {
      const relation = this.schema.relations.filter(
        (relation) => relation.collection === this.collection && relation.field === field.field
      )[0];

      const relatedContentsService = new ContentsService(relation.relatedCollection, {
        schema: this.schema,
      });
      const data = await relatedContentsService.readMany({
        filter: { [relation.relatedField]: { _in: contents.map((content) => content.id) } },
      });

      children[field.field] = { relatedField: relation.relatedField, data };
    }

    // /////////////////////////////////////
    // Contents
    // /////////////////////////////////////
    const overview = this.schema.collections[this.collection];
    for (let content of contents) {
      for (let field of aliasFields) {
        const child = children[field.field];
        content[field.field] = child.data.filter(
          (data: any) => data[child.relatedField] === content.id
        );
      }
    }

    return contents;
  }

  /**
   * @description Create content
   * @param data
   * @param fields
   * @returns primary key
   */
  async createContent(data: Record<string, any>, fields: FieldOverview[]): Promise<PrimaryKey> {
    const contentId = await this.database.transaction(async (tx) => {
      const relationDeletedBody = pick(data, this.nonAliasFields(fields));

      // /////////////////////////////////////
      // Save content
      // /////////////////////////////////////
      const contentsService = new ContentsService(this.collection, {
        database: tx,
        schema: this.schema,
      });
      const contentId = await contentsService.createOne(relationDeletedBody);

      // /////////////////////////////////////
      // Update relational foreign key
      // /////////////////////////////////////
      const relations = this.schema.relations.filter(
        (relation) => relation.collection === this.collection
      );

      for (let relation of relations) {
        const postContentData = data[relation.field];
        if (postContentData) {
          const postContentIds = postContentData.map((manyCollection: any) => manyCollection.id);

          const relatedContentsService = new ContentsService(relation.relatedCollection, {
            database: tx,
            schema: this.schema,
          });
          await relatedContentsService.saveOneToMany(
            contentId,
            relation.relatedField,
            postContentIds
          );
        }
      }

      return contentId;
    });

    return contentId;
  }

  /**
   * @description Update content
   * @param key
   * @param data
   * @param fields
   */
  async updateContent(
    key: PrimaryKey,
    data: Record<string, any>,
    fields: FieldOverview[]
  ): Promise<void> {
    await this.database.transaction(async (tx) => {
      // /////////////////////////////////////
      // Update content
      // /////////////////////////////////////
      const relationDeletedBody = pick(data, this.nonAliasFields(fields));
      const contentsService = new ContentsService(this.collection, {
        database: tx,
        schema: this.schema,
      });

      await contentsService.updateOne(key, relationDeletedBody);

      // /////////////////////////////////////
      // Update relational foreign key
      // /////////////////////////////////////
      const relations = this.schema.relations.filter(
        (relation) => relation.collection === this.collection
      );

      for (let relation of relations) {
        const postContentData = data[relation.field];
        if (postContentData) {
          const postContentIds = postContentData.map((manyCollection: any) => manyCollection.id);

          const relatedContentsService = new ContentsService(relation.relatedCollection, {
            database: tx,
            schema: this.schema,
          });
          await relatedContentsService.saveOneToMany(key, relation.relatedField, postContentIds);
        }
      }
    });
  }

  /**
   * @description Delete content
   * @param key
   */
  async deleteContent(key: PrimaryKey): Promise<void> {
    await this.database.transaction(async (tx) => {
      const contentsService = new ContentsService(this.collection, {
        database: tx,
        schema: this.schema,
      });

      // /////////////////////////////////////
      // Relational foreign key to null
      // /////////////////////////////////////
      const relations = this.schema.relations.filter(
        (relation) => relation.collection === this.collection
      );

      for (let relation of relations) {
        const relatedContentsService = new ContentsService(relation.relatedCollection, {
          database: tx,
          schema: this.schema,
        });
        const contents = await relatedContentsService.readMany({
          filter: { [relation.relatedField]: { _eq: key } },
        });

        for (let content of contents) {
          await relatedContentsService.updateOne(content.id, { [relation.relatedField]: null });
        }
      }

      // /////////////////////////////////////
      // Delete content
      // /////////////////////////////////////
      await contentsService.deleteOne(key);
    });
  }

  private async saveOneToMany(
    contentId: number,
    relatedField: string,
    postRelatedContentIds: number[]
  ) {
    const contents = await this.readMany({
      filter: { [relatedField]: { _eq: contentId } },
    });

    for (const content of contents) {
      if (!postRelatedContentIds.includes(content.id)) {
        // Unselected, set null to foreign key.
        await this.updateOne(content.id, { [relatedField]: null });
      }
    }

    for (const id of postRelatedContentIds) {
      await this.updateOne(id, { [relatedField]: contentId });
    }
  }

  private nonAliasFields(fields: FieldOverview[]): string[] {
    return fields
      .filter((field) => !field.alias)
      .reduce((acc: string[], field): string[] => {
        return [...acc, field.field];
      }, []);
  }

  private makeQuery(appAccess: Boolean, collection: CollectionOverview, key?: PrimaryKey): Query {
    const fieldFilters: FieldFilter[] = [];

    if (!appAccess && collection.statusField) {
      // For Non-application, only public data can be accessed.
      fieldFilters.push({
        [collection.statusField]: { _eq: collection.publishValue || undefined },
      });
    }

    if (key) {
      fieldFilters.push({ id: { _eq: key } });
    }

    const query: Query = {};
    switch (fieldFilters.length) {
      case 0:
        break;
      case 1:
        query.filter = fieldFilters[0];
        break;
      default:
        query.filter = {
          _and: fieldFilters,
        };
        break;
    }

    return query;
  }
}
