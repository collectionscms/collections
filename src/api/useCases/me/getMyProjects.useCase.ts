import { Permission, Project, Role } from '@prisma/client';
import { MeRepository } from '../../data/user/me.repository.js';
import { BypassPrismaType } from '../../database/prisma/client.js';

type GetMyProjectsUseCaseResponse = {
  projectRoles: {
    project: Project;
    role: Role;
    permissions: Permission[];
  }[];
};

export class GetMyProjectsUseCase {
  constructor(
    private readonly prisma: BypassPrismaType,
    private readonly meRepository: MeRepository
  ) {}

  async execute(userId: string): Promise<GetMyProjectsUseCaseResponse> {
    const result = await this.meRepository.findMeWithProjects(this.prisma, userId);

    return {
      projectRoles: result.projectRoles.map((projectRole) => ({
        project: projectRole.project.toResponse(),
        role: projectRole.role.toResponse(),
        permissions: projectRole.permissions.map((permission) => permission.toResponse()),
      })),
    };
  }
}
