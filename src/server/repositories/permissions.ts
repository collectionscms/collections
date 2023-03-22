import { Permission } from '../../shared/types';
import { AbstractRepositoryOptions, BaseRepository, BaseTransaction } from './base';

export default class PermissionsRepository extends BaseRepository<Permission> {
  constructor(collection: string = 'superfast_permissions', options?: AbstractRepositoryOptions) {
    super(collection, options);
  }

  transacting(trx: BaseTransaction): PermissionsRepository {
    const repositoryTransaction = new PermissionsRepository(this.collection, {
      knex: trx.transaction,
    });
    return repositoryTransaction;
  }

  deleteAll(data: Partial<Permission>): Promise<boolean> {
    return this.queryBuilder.where(data).delete();
  }
}
