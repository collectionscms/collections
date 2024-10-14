import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { RoleWithPermissions } from '../../../types/index.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { RoleRepository } from '../../persistence/role/role.repository.js';

export class GetRoleUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly roleRepository: RoleRepository
  ) {}

  async execute(roleId: string): Promise<RoleWithPermissions> {
    const roleWithPermissions = await this.roleRepository.findOneWithPermissions(
      this.prisma,
      roleId
    );

    if (!roleWithPermissions) {
      throw new RecordNotFoundException('record_not_found');
    }

    return {
      ...roleWithPermissions.role.toResponse(),
      permissions: roleWithPermissions.permissions.map((permission) => permission.action),
    };
  }
}
