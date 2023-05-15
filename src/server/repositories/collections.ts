import { Collection } from '../../config/types.js';
import { RecordNotUniqueException } from '../../exceptions/database/recordNotUnique.js';
import { AbstractRepositoryOptions, BaseRepository, BaseTransaction } from './base.js';

export class CollectionsRepository extends BaseRepository<Collection> {
  constructor(collection: string = 'superfast_collections', options?: AbstractRepositoryOptions) {
    super(collection, options);
  }

  transacting(trx: BaseTransaction): CollectionsRepository {
    const repositoryTransaction = new CollectionsRepository(this.collection, {
      knex: trx.transaction,
    });
    return repositoryTransaction;
  }

  async create(item: Omit<Collection, 'id'>): Promise<Collection> {
    await this.checkUniqueCollection(item.collection);
    const [output] = await this.queryBuilder.insert(item).returning('*');

    return output as Promise<Collection>;
  }

  private async checkUniqueCollection(collection: string) {
    const collections = await this.read({ collection });
    if (collections.length) {
      throw new RecordNotUniqueException('already_registered_name');
    }
  }
}
