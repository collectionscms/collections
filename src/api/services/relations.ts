import { Relation } from '../database/schemas.js';
import { AbstractServiceOptions, BaseService } from './base.js';

export class RelationsService extends BaseService<Relation> {
  constructor(options: AbstractServiceOptions) {
    super('CollectionsRelations', options);
  }

  /**
   * @description Get relations for a model.
   * @param modelId
   * @param field
   * @returns relations
   */
  getRelations(modelId: string, field: string): Promise<Relation[]> {
    return this.database(this.model)
      .where({ oneModelId: modelId, oneField: field })
      .orWhere({ manyModelId: modelId, manyField: field });
  }
}
