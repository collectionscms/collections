import { Role } from '@prisma/client';
import { RoleRepository } from '../../data/role/role.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';

export class GetRoleUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly roleRepository: RoleRepository
  ) {}

  async execute(roleId: string): Promise<Role> {
    const role = await this.roleRepository.findOne(this.prisma, roleId);

    return role.toResponse();
  }
}
