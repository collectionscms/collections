import { GetRelation } from '../../config/types.js';
import { Relation } from '../database/schemas.js';
import { AbstractServiceOptions, BaseService } from './base.js';

export class RelationsService extends BaseService<Relation> {
  constructor(options: AbstractServiceOptions) {
    super('superfast_relations', options);
  }

  /**
   * @description Get relations for a collection.
   * @param collection
   * @param field
   * @returns relations
   */
  getRelations(collection: string, field: string): Promise<GetRelation[]> {
    return this.database(this.collection)
      .where({ one_collection: collection, one_field: field })
      .orWhere({ many_collection: collection, many_field: field });
  }
}
