import { Permission, Project, Role } from '@prisma/client';
import { UserRepository } from '../../persistence/user/user.repository.js';
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
    private readonly userRepository: UserRepository
  ) {}

  async execute(userId: string): Promise<GetMyProjectsUseCaseResponse> {
    const result = await this.userRepository.findOneWithProjects(this.prisma, userId);

    return {
      projectRoles: result.projectRoles.map((projectRole) => ({
        project: projectRole.project.toResponse(),
        role: projectRole.role.toResponse(),
        permissions: projectRole.permissions.map((permission) => permission.toResponse()),
      })),
    };
  }
}
