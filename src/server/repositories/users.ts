import { MeUser, User } from '../../shared/types';
import { AbstractRepositoryOptions, BaseRepository, BaseTransaction } from './base';

export default class UsersRepository extends BaseRepository<User> {
  constructor(collection: string = 'superfast_users', options?: AbstractRepositoryOptions) {
    super(collection, options);
  }

  transacting(trx: BaseTransaction): UsersRepository {
    const repositoryTransaction = new UsersRepository(this.collection, {
      knex: trx.transaction,
    });
    return repositoryTransaction;
  }

  readWithRole(): Promise<User[]> {
    return this.queryBuilder
      .select('u.*', {
        roleId: 'r.id',
        roleName: 'r.name',
        roleDescription: 'r.description',
        roleAdminAccess: 'r.admin_access',
      })
      .from('superfast_users AS u')
      .join('superfast_roles AS r', 'r.id', 'u.role_id');
  }

  readOneWithRole(data: { id?: number; token?: string }): Promise<User> {
    const condition = {};

    if (data.id) {
      condition['u.id'] = data.id;
    }

    if (data.token) {
      condition['u.token'] = data.token;
    }

    return this.queryBuilder
      .select('u.*', {
        roleId: 'r.id',
        roleName: 'r.name',
        roleDescription: 'r.description',
        roleAdminAccess: 'r.admin_access',
      })
      .from('superfast_users AS u')
      .join('superfast_roles AS r', 'r.id', 'u.role_id')
      .where(condition)
      .first();
  }

  readMe(data: { id?: number; email?: string; token?: string }): Promise<MeUser> {
    const condition = {};

    if (data.id) {
      condition['u.id'] = data.id;
    }

    if (data.email) {
      condition['u.email'] = data.email;
    }

    if (data.token) {
      condition['u.api_key'] = data.token;
    }

    return this.queryBuilder
      .select('u.id', 'u.user_name', 'u.password', 'u.api_key', {
        roleId: 'r.id',
        adminAccess: 'r.admin_access',
      })
      .from('superfast_users AS u')
      .join('superfast_roles AS r', 'r.id', 'u.role_id')
      .where(condition)
      .first();
  }
}
