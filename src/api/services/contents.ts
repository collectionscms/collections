import { pick } from '../../utilities/pick.js';
import { ModelOverview, FieldOverview } from '../database/overview.js';
import { PrimaryKey } from '../database/schemas.js';
import { FieldFilter, Query } from '../database/types.js';
import { AbstractServiceOptions, BaseService } from './base.js';

export class ContentsService extends BaseService<any> {
  constructor(model: string, options: AbstractServiceOptions) {
    super(model, options);
  }

  /**
   * @description Read contents, including related contents
   * @param query
   * @returns contents
   */
  async getContents(appAccess: boolean, model: ModelOverview, key?: PrimaryKey): Promise<any[]> {
    const query = this.makeQuery(appAccess, model, key);
    const contents = await this.readMany(query);

    const children: Record<string, { relatedField: string; data: any }> = {};

    const aliasFields = Object.values(this.schema.models[this.model].fields).filter(
      (field) => field.alias
    );

    // /////////////////////////////////////
    // Alias fields
    // /////////////////////////////////////
    for (let field of aliasFields) {
      const relation = this.schema.relations.filter(
        (relation) => relation.model === this.model && relation.field === field.field
      )[0];

      const relatedContentsService = new ContentsService(relation.relatedModel, {
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
    const overview = this.schema.models[this.model];
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
      const contentsService = new ContentsService(this.model, {
        database: tx,
        schema: this.schema,
      });
      const contentId = await contentsService.createOne(relationDeletedBody);

      // /////////////////////////////////////
      // Update relational foreign key
      // /////////////////////////////////////
      const relations = this.schema.relations.filter((relation) => relation.model === this.model);

      for (let relation of relations) {
        const postContentData = data[relation.field];
        if (postContentData) {
          const postContentIds = postContentData.map((manyModel: any) => manyModel.id);

          const relatedContentsService = new ContentsService(relation.relatedModel, {
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
      const contentsService = new ContentsService(this.model, {
        database: tx,
        schema: this.schema,
      });

      await contentsService.updateOne(key, relationDeletedBody);

      // /////////////////////////////////////
      // Update relational foreign key
      // /////////////////////////////////////
      const relations = this.schema.relations.filter((relation) => relation.model === this.model);

      for (let relation of relations) {
        const postContentData = data[relation.field];
        if (postContentData) {
          const postContentIds = postContentData.map((manyModel: any) => manyModel.id);

          const relatedContentsService = new ContentsService(relation.relatedModel, {
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
      const contentsService = new ContentsService(this.model, {
        database: tx,
        schema: this.schema,
      });

      // /////////////////////////////////////
      // Relational foreign key to null
      // /////////////////////////////////////
      const relations = this.schema.relations.filter((relation) => relation.model === this.model);

      for (let relation of relations) {
        const relatedContentsService = new ContentsService(relation.relatedModel, {
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
    contentId: PrimaryKey,
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

  private makeQuery(appAccess: Boolean, model: ModelOverview, key?: PrimaryKey): Query {
    const fieldFilters: FieldFilter[] = [];

    if (!appAccess && model.statusField) {
      // For Non-application, only public data can be accessed.
      fieldFilters.push({
        [model.statusField]: { _eq: model.publishValue || undefined },
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
