import { PrismaClient } from '@prisma/client';
import { ProjectEntity } from '../../data/project/project.entity.js';
import { ProjectRepository } from '../../data/project/project.repository.js';

export class UpdateProjectUseCase {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly projectRepository: ProjectRepository
  ) {}

  async execute(id: string, params: { name: string }): Promise<ProjectEntity> {
    const record = await this.projectRepository.findOneById(this.prisma, id);

    const entity = ProjectEntity.Reconstruct({
      ...record.toPersistence(),
      name: params.name,
    });

    return await this.projectRepository.update(this.prisma, id, entity);
  }
}
