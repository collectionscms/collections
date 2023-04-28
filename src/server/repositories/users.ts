import { MeUser, User } from '../../config/types.js';
import { RecordNotUniqueException } from '../../exceptions/database/recordNotUnique.js';
import { AbstractRepositoryOptions, BaseRepository, BaseTransaction } from './base.js';

export class UsersRepository extends BaseRepository<User> {
  constructor(collection: string = 'superfast_users', options?: AbstractRepositoryOptions) {
    super(collection, options);
  }

  transacting(trx: BaseTransaction): UsersRepository {
    const repositoryTransaction = new UsersRepository(this.collection, {
      knex: trx.transaction,
    });
    return repositoryTransaction;
  }

  async create(item: Omit<User, 'id'>): Promise<User> {
    await this.checkUniqueEmail(item.email);
    const [output] = await this.queryBuilder.insert(item).returning('id');

    return output as Promise<User>;
  }

  async update(id: number, item: Partial<User>): Promise<boolean> {
    if (item.email) {
      await this.checkUniqueEmail(item.email, id);
    }

    return this.queryBuilder.where('id', id).update(item);
  }

  private async checkUniqueEmail(email: string, myId?: number) {
    const users = await this.read({ email });
    if (users.length && users[0].id !== myId) {
      throw new RecordNotUniqueException('already_registered_email');
    }
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
    const condition: { [index: string]: any } = {};

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
    const condition: { [index: string]: any } = {};

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

  readResetPasswordToken(token: string): Promise<User> {
    return this.queryBuilder
      .select('u.*')
      .from('superfast_users AS u')
      .where('u.reset_password_token', token)
      .where('u.reset_password_expiration', '>', Date.now())
      .first();
  }
}
