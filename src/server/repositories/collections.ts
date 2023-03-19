import { Collection } from '../../shared/types';
import { AbstractRepositoryOptions, BaseRepository, BaseTransaction } from './base';

export default class CollectionsRepository extends BaseRepository<Collection> {
  constructor(collection: string = 'superfast_collections', options?: AbstractRepositoryOptions) {
    super(collection, options);
  }

  transacting(trx: BaseTransaction): CollectionsRepository {
    const repositoryTransaction = new CollectionsRepository(this.collection, {
      knex: trx.transaction,
    });
    return repositoryTransaction;
  }
}
