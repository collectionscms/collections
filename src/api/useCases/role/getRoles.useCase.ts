import { Role } from '@prisma/client';
import { RoleRepository } from '../../persistence/role/role.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';

export class GetRolesUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly roleRepository: RoleRepository
  ) {}

  async execute(): Promise<Role[]> {
    const roles = await this.roleRepository.findMany(this.prisma);

    return roles.map((role) => role.toResponse());
  }
}
