import { Relation } from '../database/schemas.js';
import { AbstractServiceOptions, BaseService } from './base.js';

export class RelationsService extends BaseService<Relation> {
  constructor(options: AbstractServiceOptions) {
    super('superfast_relations', options);
  }

  /**
   * @description Get relations for a collection.
   * @param collectionId
   * @param field
   * @returns relations
   */
  getRelations(collectionId: string, field: string): Promise<Relation[]> {
    return this.database(this.collection)
      .where({ one_collection_id: collectionId, one_field: field })
      .orWhere({ many_collection_id: collectionId, many_field: field });
  }
}
