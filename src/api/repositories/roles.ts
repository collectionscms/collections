import { Role } from '../../config/types.js';
import { AbstractRepositoryOptions, BaseRepository, BaseTransaction } from './base.js';

// TODO: Repository layer concerns allows only schema. see: ./fields.ts
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
