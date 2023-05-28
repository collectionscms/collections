import { Relation } from '../../config/types.js';
import { AbstractRepositoryOptions, BaseRepository, BaseTransaction } from './base.js';

export class RelationsRepository extends BaseRepository<Relation> {
  constructor(collection: string = 'superfast_relations', options?: AbstractRepositoryOptions) {
    super(collection, options);
  }

  transacting(trx: BaseTransaction): RelationsRepository {
    const repositoryTransaction = new RelationsRepository(this.collection, {
      knex: trx.transaction,
    });
    return repositoryTransaction;
  }
}
