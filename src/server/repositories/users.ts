import argon2 from 'argon2';
import { AuthUser, User } from '../../config/types.js';
import { RecordNotUniqueException } from '../../exceptions/database/recordNotUnique.js';
import { InvalidCredentialsException } from '../../exceptions/invalidCredentials.js';
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

  async create(item: Omit<User, 'id'>): Promise<number> {
    await this.checkUniqueEmail(item.email);
    const [output] = await this.queryBuilder.insert(item);
    return output;
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
        role_id: 'r.id',
        role_name: 'r.name',
        role_description: 'r.description',
        role_admin_access: 'r.admin_access',
      })
      .from('superfast_users AS u')
      .join('superfast_roles AS r', 'r.id', 'u.role_id');
  }

  readOneWithRole(id: number): Promise<User> {
    return this.queryBuilder
      .select('u.*', {
        role_id: 'r.id',
        role_name: 'r.name',
        role_description: 'r.description',
        role_admin_access: 'r.admin_access',
      })
      .from('superfast_users AS u')
      .join('superfast_roles AS r', 'r.id', 'u.role_id')
      .where('u.id', id)
      .first();
  }

  async login(email: string, password: string): Promise<AuthUser> {
    const user = await this.queryBuilder
      .select('u.id', 'u.user_name', 'u.password', 'u.email', 'u.api_key', {
        role_id: 'r.id',
        admin_access: 'r.admin_access',
      })
      .from('superfast_users AS u')
      .join('superfast_roles AS r', 'r.id', 'u.role_id')
      .whereRaw('LOWER(??) = ?', ['u.email', email.toLowerCase()])
      .first();

    if (!user || !(await argon2.verify(user.password, password))) {
      throw new InvalidCredentialsException('incorrect_email_or_password');
    }

    return this.toAuthUser(user);
  }

  async readMe(data: { id?: number; apiKey?: string }): Promise<AuthUser | null> {
    if (!data.id && !data.apiKey) return null;

    const condition: { [index: string]: any } = {};

    if (data.id) {
      condition['u.id'] = data.id;
    }

    if (data.apiKey) {
      condition['u.api_key'] = data.apiKey;
    }

    const user = await this.queryBuilder
      .select('u.id', 'u.user_name', 'u.api_key', {
        role_id: 'r.id',
        admin_access: 'r.admin_access',
      })
      .from('superfast_users AS u')
      .join('superfast_roles AS r', 'r.id', 'u.role_id')
      .where(condition)
      .first();

    return this.toAuthUser(user);
  }

  readResetPasswordToken(token: string): Promise<User> {
    return this.queryBuilder
      .select('u.*')
      .from('superfast_users AS u')
      .where('u.reset_password_token', token)
      .where('u.reset_password_expiration', '>', Date.now())
      .first();
  }

  private toAuthUser(user: {
    id: number;
    role_id: number;
    user_name: string;
    admin_access: boolean;
  }): AuthUser {
    return {
      id: user.id,
      roleId: user.role_id,
      userName: user.user_name,
      adminAccess: user.admin_access,
      appAccess: null,
    };
  }
}
