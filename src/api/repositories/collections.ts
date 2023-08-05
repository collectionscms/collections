import { RecordNotUniqueException } from '../../exceptions/database/recordNotUnique.js';
import { CollectionSchema } from '../database/schemas.js';
import { AbstractRepositoryOptions, BaseRepository, BaseTransaction } from './base.js';

export class CollectionsRepository extends BaseRepository<CollectionSchema> {
  constructor(collection: string = 'superfast_collections', options?: AbstractRepositoryOptions) {
    super(collection, options);
  }

  transacting(trx: BaseTransaction): CollectionsRepository {
    const repositoryTransaction = new CollectionsRepository(this.collection, {
      knex: trx.transaction,
    });
    return repositoryTransaction;
  }

  async create(item: Omit<CollectionSchema, 'id'>): Promise<number> {
    await this.checkUniqueCollection(item.collection);
    return super.create(item);
  }

  private async checkUniqueCollection(collection: string) {
    const collections = await this.read({ collection });
    if (collections.length) {
      throw new RecordNotUniqueException('already_registered_name');
    }
  }
}
