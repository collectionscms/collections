import { UnprocessableEntityException } from '../../exceptions/unprocessableEntity.js';
import { PrimaryKey, Role } from '../database/schemas.js';
import { AbstractServiceOptions, BaseService } from './base.js';
import { PermissionsService } from './permissions.js';
import { UsersService } from './users.js';

export class RolesService extends BaseService<Role> {
  constructor(options: AbstractServiceOptions) {
    super('collections_roles', options);
  }

  /**
   * @description Delete a role with its permissions
   * @param key
   */
  async deleteWithPermissions(key: PrimaryKey): Promise<void> {
    const usersService = new UsersService({ schema: this.schema });
    const users = await usersService.readMany({ filter: { role_id: { _eq: key } } });
    if (users.length > 0) {
      throw new UnprocessableEntityException('can_not_delete_role_in_use');
    }

    const role = await this.readOne(key);
    if (role.admin_access) {
      const roles = await this.readMany({
        filter: { admin_access: { _eq: true } },
      });
      if (roles.length === 1) {
        throw new UnprocessableEntityException('can_not_delete_last_admin_role');
      }
    }

    await this.transaction(async (tx) => {
      // /////////////////////////////////////
      // Delete permissions
      // /////////////////////////////////////
      const permissionsService = new PermissionsService({
        database: tx.transaction,
        schema: this.schema,
      });

      const permissions = await permissionsService.readMany({
        filter: { role_id: { _eq: key } },
      });

      const keys = permissions.map((permission) => permission.id);
      await permissionsService.deleteMany(keys);

      // /////////////////////////////////////
      // Delete Role
      // /////////////////////////////////////
      const rolesWithTransactingService = new RolesService({
        database: tx.transaction,
        schema: this.schema,
      });
      await rolesWithTransactingService.deleteOne(key);
    });
  }
}
