import { Permission } from '@prisma/client';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { RoleRepository } from '../../persistence/role/role.repository.js';

export class GetPermissionsUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly roleRepository: RoleRepository
  ) {}

  async execute(roleId: string): Promise<Permission[]> {
    const rolePermissions = await this.roleRepository.findOneWithPermissions(this.prisma, roleId);
    if (!rolePermissions) {
      throw new RecordNotFoundException('record_not_found');
    }

    return rolePermissions.permissions.map((permission) => permission.toResponse());
  }
}
