import { Me, ProjectWithRole } from '../../../types/index.js';
import { MeRepository } from '../../data/user/me.repository.js';
import { BypassPrismaType } from '../../database/prisma/client.js';

export class LoginUseCase {
  constructor(
    private readonly prisma: BypassPrismaType,
    private readonly meRepository: MeRepository
  ) {}

  async execute(email: string, password: string): Promise<Me> {
    const { user, projectRoles } = await this.meRepository.login(this.prisma, email, password);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
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
