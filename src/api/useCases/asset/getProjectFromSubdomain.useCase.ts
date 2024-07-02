import { Project } from '@prisma/client';
import { ProjectRepository } from '../../data/project/project.repository.js';
import { BypassPrismaType } from '../../database/prisma/client.js';

export class GetProjectFromSubdomainUseCase {
  constructor(
    private readonly prisma: BypassPrismaType,
    private readonly projectRepository: ProjectRepository
  ) {}

  async execute(subdomain: string): Promise<Project> {
    const entity = await this.projectRepository.findOneBySubdomain(this.prisma, subdomain);

    return entity.toResponse();
  }
}
