import { Project } from '@prisma/client';
import { ProjectRepository } from '../../persistence/project/project.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';

export class GetProjectUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly projectRepository: ProjectRepository
  ) {}

  async execute(projectId: string): Promise<Project> {
    const record = await this.projectRepository.findOneById(this.prisma, projectId);
    return record.toResponse();
  }
}
