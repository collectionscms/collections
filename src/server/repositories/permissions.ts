import { Permission } from '../../shared/types';
import { AbstractRepositoryOptions, BaseRepository, BaseTransaction } from './base';

export class PermissionsRepository extends BaseRepository<Permission> {
  constructor(options?: AbstractRepositoryOptions) {
    super('superfast_permissions', options);
  }

  transacting(trx: BaseTransaction): PermissionsRepository {
    const repositoryTransaction = new PermissionsRepository({
      knex: trx.transaction,
    });
    return repositoryTransaction;
  }

  deleteAll(data: Partial<Permission>): Promise<boolean> {
    return this.queryBuilder.where(data).delete();
  }
}
