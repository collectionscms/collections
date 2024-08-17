import { ProjectWithRole } from '../../../types/index.js';
import { UserRepository } from '../../persistences/user/user.repository.js';
import { BypassPrismaType } from '../../database/prisma/client.js';

export class GetMyProjectRolesUseCase {
  constructor(
    private readonly prisma: BypassPrismaType,
    private readonly userRepository: UserRepository
  ) {}

  async execute(userId: string): Promise<{ projectRoles: { [key: string]: ProjectWithRole } }> {
    const { projectRoles } = await this.userRepository.findOneWithProjects(this.prisma, userId);

    return {
      projectRoles: projectRoles.reduce((acc: { [key: string]: ProjectWithRole }, projectRole) => {
        acc[projectRole.project.subdomain] = {
          ...projectRole.project.toResponse(),
          isAdmin: projectRole.role.isAdmin,
          permissions: projectRole.permissions.map((permission) => permission.toResponse()),
        };
        return acc;
      }, {}),
    };
  }
}
