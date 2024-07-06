import { Project } from '@prisma/client';
import { ProjectRepository } from '../../data/project/project.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { UpdateProjectUseCaseSchemaType } from './updateProject.schema.js';

export class UpdateProjectUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly projectRepository: ProjectRepository
  ) {}

  async execute({ id, name, primaryLocale }: UpdateProjectUseCaseSchemaType): Promise<Project> {
    const project = await this.projectRepository.findOneById(this.prisma, id);
    project.updateProject(name, primaryLocale);

    const entity = await this.projectRepository.update(this.prisma, id, project);
    return entity.toResponse();
  }
}
