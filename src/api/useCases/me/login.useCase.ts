import { Me } from '../../../types/index.js';
import { MeRepository } from '../../data/user/me.repository.js';
import { BypassPrismaType } from '../../database/prisma/client.js';

type LoginUseCaseResponse = {
  me: Me;
};

export class LoginUseCase {
  constructor(
    private readonly prisma: BypassPrismaType,
    private readonly meRepository: MeRepository
  ) {}

  async execute(email: string, password: string): Promise<LoginUseCaseResponse> {
    const { user, projects } = await this.meRepository.login(this.prisma, email, password);

    return {
      me: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: true,
        projects: projects.map((project) => project.toResponse()),
        // todo
        roles: [],
        // isAdmin: user.userProjects[0].isAdmin,
      },
    };
  }
}
