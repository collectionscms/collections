import { Project } from '@prisma/client';
import { BypassPrismaType } from '../../database/prisma/client.js';
import { ProjectRepository } from '../../persistence/project/project.repository.js';

export class GetProjectFromSubdomainUseCase {
  constructor(
    private readonly prisma: BypassPrismaType,
    private readonly projectRepository: ProjectRepository
  ) {}

  async execute(subdomain: string): Promise<Project | null> {
    const entity = await this.projectRepository.findOneBySubdomain(this.prisma, subdomain);

    return entity ? entity.toResponse() : null;
  }
}
