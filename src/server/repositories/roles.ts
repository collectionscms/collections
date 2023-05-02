import { Role } from '../../config/types.js';
import { AbstractRepositoryOptions, BaseRepository, BaseTransaction } from './base.js';

export class RolesRepository extends BaseRepository<Role> {
  constructor(collection: string = 'superfast_roles', options?: AbstractRepositoryOptions) {
    super(collection, options);
  }

  transacting(trx: BaseTransaction): RolesRepository {
    const repositoryTransaction = new RolesRepository(this.collection, {
      knex: trx.transaction,
    });
    return repositoryTransaction;
  }
}
