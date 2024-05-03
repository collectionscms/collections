import { Project } from '@prisma/client';
import { MeRepository } from '../../data/user/me.repository.js';
import { PrismaType } from '../../database/prisma/client.js';

type GetMyProjectsUseCaseResponse = {
  projects: Project[];
};

export class GetMyProjectsUseCase {
  constructor(
    private readonly prisma: PrismaType,
    private readonly meRepository: MeRepository
  ) {}

  async execute(userId: string): Promise<GetMyProjectsUseCaseResponse> {
    const result = await this.meRepository.findMeWithProjects(this.prisma, userId);

    return {
      projects: result.projects.map((project) => project.toResponse()),
    };
  }
}
