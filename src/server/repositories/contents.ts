import { referencedTypes } from '../database/schemas.js';
import { BaseRepository, BaseTransaction } from './base.js';
import { FieldsRepository } from './fields.js';
import { RelationsRepository } from './relations.js';

export class ContentsRepository extends BaseRepository<any> {
  transacting(trx: BaseTransaction): ContentsRepository {
    const repositoryTransaction = new ContentsRepository(this.collection, {
      knex: trx.transaction,
    });
    return repositoryTransaction;
  }

  // Read content as singleton.
  async readSingleton(collectionName: string, data: Record<string, any>) {
    const contents = await this.read(data);
    const content = contents[0];
    if (!content) return content;

    // relational contents (one-to-many)
    const relationalContents = await this.readRelationalContents(content.id, collectionName);

    return {
      ...content,
      ...relationalContents,
    };
  }

  // Get the relational contents of the collection.
  async readRelationalContents(contentId: number, collectionName: string) {
    const fieldsRepository = new FieldsRepository();
    const relationsRepository = new RelationsRepository();
    const fields = await fieldsRepository.read({ collection: collectionName });

    const relationalContents: Record<string, any> = {};
    const referencedFields = fields.filter((field) => referencedTypes.includes(field.interface));
    for (let field of referencedFields) {
      const relations = await relationsRepository.read({
        one_collection: field.collection,
        one_field: field.field,
      });
      if (!relations[0]) return;

      const contentsRepository = new ContentsRepository(relations[0].many_collection);

      const params: Record<string, any> = {};
      params[relations[0].many_field] = contentId;

      const contents = await contentsRepository.read(params);
      relationalContents[field.field] = contents;
    }

    return relationalContents;
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
}
