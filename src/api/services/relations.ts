import { Relation } from '../database/schemas.js';
import { AbstractServiceOptions, BaseService } from './base.js';

export class RelationsService extends BaseService<Relation> {
  constructor(options: AbstractServiceOptions) {
    super('collections_relations', options);
  }

  /**
   * @description Get relations for a model.
   * @param modelId
   * @param field
   * @returns relations
   */
  getRelations(modelId: string, field: string): Promise<Relation[]> {
    return this.database(this.model)
      .where({ one_model_id: modelId, one_field: field })
      .orWhere({ many_model_id: modelId, many_field: field });
  }
}
