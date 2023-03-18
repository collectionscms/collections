import { Collection } from '../../shared/types';
import { AbstractRepositoryOptions, BaseRepository, BaseTransaction } from './base';

export class CollectionsRepository extends BaseRepository<Collection> {
  constructor(options?: AbstractRepositoryOptions) {
    super('superfast_collections', options);
  }

  transacting(trx: BaseTransaction): CollectionsRepository {
    const repositoryTransaction = new CollectionsRepository({
      knex: trx.transaction,
    });
    return repositoryTransaction;
  }
}
