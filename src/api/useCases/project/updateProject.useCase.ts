import { Project } from '@prisma/client';
import { ProjectRepository } from '../../persistence/project/project.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { UpdateProjectUseCaseSchemaType } from './updateProject.useCase.schema.js';

export class UpdateProjectUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly projectRepository: ProjectRepository
  ) {}

  async execute({ id, name, sourceLanguage }: UpdateProjectUseCaseSchemaType): Promise<Project> {
    const project = await this.projectRepository.findOneById(this.prisma, id);
    project.updateProject(name, sourceLanguage);

    const entity = await this.projectRepository.update(this.prisma, id, project);
    return entity.toResponse();
  }
}
