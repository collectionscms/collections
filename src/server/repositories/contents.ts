import { SchemaOverview } from '../database/overview.js';
import { BaseRepository, BaseTransaction } from './base.js';

export class ContentsRepository extends BaseRepository<any> {
  transacting(trx: BaseTransaction): ContentsRepository {
    const repositoryTransaction = new ContentsRepository(this.collection, {
      knex: trx.transaction,
    });
    return repositoryTransaction;
  }

  // Read contents, including related contents
  async readMany(data: Record<string, any>, schema: SchemaOverview) {
    const contents = await this.read(data);

    const children: Record<string, { relatedField: string; data: any }> = {};

    const aliasFields = Object.values(schema.collections[this.collection].fields).filter(
      (field) => field.alias
    );

    for (let field of aliasFields) {
      const relation = schema.relations.filter(
        (relation) => relation.collection === this.collection && relation.field === field.field
      )[0];

      const repository = new ContentsRepository(relation.relatedCollection);
      const data = await repository.readIn(
        relation.relatedField,
        contents.map((content) => content.id)
      );

      children[field.field] = { relatedField: relation.relatedField, data };
    }

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

  // Saves one-to-many relations. If unselected, set null to foreign key.
  async saveOneToMany(contentId: number, relatedField: string, postRelatedContentIds: number[]) {
    const contents = await this.read({ [relatedField]: contentId });
    for (let content of contents) {
      if (!postRelatedContentIds.includes(content.id)) {
        // Unselected, set null to foreign key.
        await this.update(content.id, { [relatedField]: null });
      }
    }

    for (let id of postRelatedContentIds) {
      await this.update(id, { [relatedField]: contentId });
    }
  }

  private readIn(field: string, data: any[]): Promise<any[]> {
    return this.queryBuilder.whereIn(field, data).select();
  }
}
