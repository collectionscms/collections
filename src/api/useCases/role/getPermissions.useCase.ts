import { Permission } from '@prisma/client';
import { RoleRepository } from '../../persistences/role/role.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';

export class GetPermissionsUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly roleRepository: RoleRepository
  ) {}

  async execute(roleId: string): Promise<Permission[]> {
    const rolePermissions = await this.roleRepository.findOneWithPermissions(this.prisma, roleId);

    return rolePermissions.permissions.map((permission) => permission.toResponse());
  }
}
