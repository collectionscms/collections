import { AuthUser } from '../../config/types.js';
import { PrimaryKey, User } from '../database/schemas.js';
import { AbstractServiceOptions, BaseService } from './base.js';
import { RolesService } from './roles.js';

export type Me = {
  user: AuthUser;
  apiKey: string | null;
};

export class UsersService extends BaseService<User> {
  constructor(options: AbstractServiceOptions) {
    super('superfast_users', options);
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
      user: this.toAuthUser(user.id, role.id, user.name, Boolean(role.admin_access)),
      apiKey: user.api_key || null,
    };
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
