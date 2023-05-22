import { Permission } from '../../config/types.js';
import { AbstractRepositoryOptions, BaseRepository, BaseTransaction } from './base.js';

export class PermissionsRepository extends BaseRepository<Permission> {
  constructor(collection: string = 'superfast_permissions', options?: AbstractRepositoryOptions) {
    super(collection, options);
  }

  transacting(trx: BaseTransaction): PermissionsRepository {
    const repositoryTransaction = new PermissionsRepository(this.collection, {
      knex: trx.transaction,
    });
    return repositoryTransaction;
  }
}
