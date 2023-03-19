import { BaseRepository, BaseTransaction } from './base';

export default class ContentsRepository extends BaseRepository<unknown> {
  transacting(trx: BaseTransaction): ContentsRepository {
    const repositoryTransaction = new ContentsRepository(this.collection, {
      knex: trx.transaction,
    });
    return repositoryTransaction;
  }
}
