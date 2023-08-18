import { GetRelation } from '../../config/types.js';
import { AbstractRepositoryOptions, BaseRepository, BaseTransaction } from './base.js';

// TODO: Repository layer concerns allows only schema. see: ./fields.ts
export class RelationsRepository extends BaseRepository<GetRelation> {
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
