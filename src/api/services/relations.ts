import { Relation } from '../database/schemas.js';
import { AbstractServiceOptions, BaseService } from './base.js';

export class RelationsService extends BaseService<Relation> {
  constructor(options: AbstractServiceOptions) {
    super('superfast_relations', options);
  }
}
