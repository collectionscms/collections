import { Collection } from '../database/schemas.js';
import { AbstractServiceOptions, BaseService } from './base.js';

export class CollectionsService extends BaseService<Collection> {
  constructor(options: AbstractServiceOptions) {
    super('superfast_collections', options);
  }
}
