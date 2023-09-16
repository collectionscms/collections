import argon2 from 'argon2';
import { RecordNotUniqueException } from '../../exceptions/database/recordNotUnique.js';
import { InvalidCredentialsException } from '../../exceptions/invalidCredentials.js';
import { AuthUser } from '../config/types.js';
import { PrimaryKey, User } from '../database/schemas.js';
import { AbstractServiceOptions, BaseService } from './base.js';
import { RolesService } from './roles.js';

export type Me = {
  auth: AuthUser;
  user: User;
};

export class UsersService extends BaseService<User> {
  constructor(options: AbstractServiceOptions) {
    super('superfast_users', options);
  }

  /**
   * @description Login a user
   * @param email
   * @param password
   * @returns auth user
   */
  async login(email: string, password: string): Promise<AuthUser> {
    const rolesService = new RolesService({ schema: this.schema });

    const user = await this.database
      .select('u.id', 'u.name', 'u.password', 'u.email', 'u.api_key', {
        role_id: 'r.id',
        admin_access: 'r.admin_access',
      })
      .from(`${this.collection} AS u`)
      .join(`${rolesService.collection} AS r`, 'r.id', 'u.role_id')
      .whereRaw('LOWER(??) = ?', ['u.email', email.toLowerCase()])
      .first();

    if (!user || !(await argon2.verify(user.password, password))) {
      throw new InvalidCredentialsException('incorrect_email_or_password');
    }

    const role = await rolesService.readOne(user.role_id);

    return this.toAuthUser(user.id, role.id, user.name, Boolean(role.admin_access));
  }

  /**
   * @description Get a user by its primary key or api key
   * @param params
   * @returns auth user or null
   */
  async readMe(params: { primaryKey?: PrimaryKey; apiKey?: string }): Promise<Me | null> {
    const { primaryKey, apiKey } = params;
    if (!primaryKey && !apiKey) return null;

    const user = await this.readMany({
      filter: primaryKey ? { id: { _eq: primaryKey } } : { api_key: { _eq: apiKey } },
    }).then((users) => (users.length > 0 ? users[0] : null));

    if (!user || !user.role_id) return null;

    const rolesService = new RolesService({ schema: this.schema });
    const role = await rolesService.readOne(user.role_id);

    return {
      auth: this.toAuthUser(user.id, role.id, user.name, Boolean(role.admin_access)),
      user: user,
    };
  }

  /**
   * @description Get users with their role
   * @param key
   * @returns users
   */
  async readWithRole(key?: PrimaryKey): Promise<User[]> {
    const rolesService = new RolesService({ database: this.database, schema: this.schema });
    const roles = await rolesService.readMany();

    const filter = key ? { filter: { id: { _eq: key } } } : {};
    const users = await this.readMany(filter);

    return users.map((user) => {
      const role = roles.find((role) => role.id === user.role_id);
      return {
        ...user,
        role_id: role?.id,
        role_name: role?.name,
        role_description: role?.description,
        role_admin_access: role?.admin_access,
      };
    });
  }

  /**
   * @description Check if email is unique
   * @param email
   * @param key
   * @returns
   */
  async checkUniqueEmail(email?: string, key?: PrimaryKey) {
    if (!email) return;

    const users = await this.readMany({
      filter: {
        email: { _eq: email },
      },
    });

    if (users.length > 0 && users[0].id !== key) {
      throw new RecordNotUniqueException('already_registered_email');
    }
  }

  private toAuthUser(
    userId: PrimaryKey,
    roleId: PrimaryKey,
    name: string,
    adminAccess: boolean
  ): AuthUser {
    return {
      id: userId,
      roleId: roleId,
      name: name,
      adminAccess: adminAccess,
      appAccess: null,
    };
  }
}
