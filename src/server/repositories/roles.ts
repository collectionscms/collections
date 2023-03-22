import { Role } from '../../shared/types';
import { AbstractRepositoryOptions, BaseRepository, BaseTransaction } from './base';

export default class RolesRepository extends BaseRepository<Role> {
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
