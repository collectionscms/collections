import { RoleWithPermissions } from '../../../types/index.js';
import { RoleRepository } from '../../persistence/role/role.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';

export class GetRoleUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly roleRepository: RoleRepository
  ) {}

  async execute(roleId: string): Promise<RoleWithPermissions> {
    const { role, permissions } = await this.roleRepository.findOneWithPermissions(
      this.prisma,
      roleId
    );

    return {
      ...role.toResponse(),
      permissions: permissions.map((permission) => permission.action),
    };
  }
}
