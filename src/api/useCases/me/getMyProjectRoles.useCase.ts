import { Permission, Project, Role } from '@prisma/client';
import { MeRepository } from '../../data/user/me.repository.js';
import { BypassPrismaType } from '../../database/prisma/client.js';

type ProjectWithRole = Project & { role: Role & { permissions: Permission[] } };

export class GetMyProjectRolesUseCase {
  constructor(
    private readonly prisma: BypassPrismaType,
    private readonly meRepository: MeRepository
  ) {}

  async execute(userId: string): Promise<{ projects: { [key: string]: ProjectWithRole } }> {
    const { projectRoles } = await this.meRepository.findMeWithProjects(this.prisma, userId);

    return {
      projects: projectRoles.reduce((acc: { [key: string]: ProjectWithRole }, projectRole) => {
        acc[projectRole.project.subdomain] = {
          ...projectRole.project.toResponse(),
          role: {
            ...projectRole.role.toResponse(),
            permissions: projectRole.permissions.map((permission) => permission.toResponse()),
          },
        };
        return acc;
      }, {}),
    };
  }
}
