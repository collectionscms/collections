import { BaseRepository, BaseTransaction } from './base.js';

export class ContentsRepository extends BaseRepository<any> {
  transacting(trx: BaseTransaction): ContentsRepository {
    const repositoryTransaction = new ContentsRepository(this.collection, {
      knex: trx.transaction,
    });
    return repositoryTransaction;
  }
}
