import { Project } from '@prisma/client';
import { MeRepository } from '../../data/user/me.repository.js';
import { BypassPrismaType } from '../../database/prisma/client.js';

type GetMyProjectsUseCaseResponse = {
  projects: Project[];
};

export class GetMyProjectsUseCase {
  constructor(
    private readonly prisma: BypassPrismaType,
    private readonly meRepository: MeRepository
  ) {}

  async execute(userId: string): Promise<GetMyProjectsUseCaseResponse> {
    const result = await this.meRepository.findMeWithProjects(this.prisma, userId);

    return {
      projects: result.projectRoles.map((projectRole) => projectRole.project.toResponse()),
    };
  }
}
