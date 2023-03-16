import { Role } from '../../shared/types';
import { AbstractRepositoryOptions, BaseRepository, BaseTransaction } from './base';

export class RolesRepository extends BaseRepository<Role> {
  constructor(options?: AbstractRepositoryOptions) {
    super('superfast_roles', options);
  }

  transacting(trx: BaseTransaction): RolesRepository {
    const repositoryTransaction = new RolesRepository({
      knex: trx.transaction,
    });
    return repositoryTransaction;
  }
}
