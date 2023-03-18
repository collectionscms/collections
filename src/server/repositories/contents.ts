import { AbstractRepositoryOptions, BaseRepository, BaseTransaction } from './base';

export class ContentsRepository extends BaseRepository<unknown> {
  constructor(collection: string, options?: AbstractRepositoryOptions) {
    super(collection, options);
  }

  transacting(trx: BaseTransaction): ContentsRepository {
    const repositoryTransaction = new ContentsRepository(this.collection, {
      knex: trx.transaction,
    });
    return repositoryTransaction;
  }
}
