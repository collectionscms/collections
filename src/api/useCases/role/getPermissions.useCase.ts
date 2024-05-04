import { Permission } from '@prisma/client';
import { PermissionRepository } from '../../data/permission/permission.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';

export class GetPermissionsUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly permissionRepository: PermissionRepository
  ) {}

  async execute(roleId: string): Promise<Permission[]> {
    const permissions = await this.permissionRepository.findPermissions(this.prisma, roleId);

    return permissions.map((permission) => permission.toResponse());
  }
}
