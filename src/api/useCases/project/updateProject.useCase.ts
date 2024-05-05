import { Project } from '@prisma/client';
import { ProjectEntity } from '../../data/project/project.entity.js';
import { ProjectRepository } from '../../data/project/project.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';

export class UpdateProjectUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly projectRepository: ProjectRepository
  ) {}

  async execute(id: string, params: { name: string }): Promise<ProjectEntity> {
    const record = await this.projectRepository.findOneById(this.prisma, id);

    const entity = ProjectEntity.Reconstruct<Project, ProjectEntity>({
      ...record.toPersistence(),
      name: params.name,
    });

    return await this.projectRepository.update(this.prisma, id, entity);
  }
}
