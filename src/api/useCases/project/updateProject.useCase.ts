import { ProjectEntity } from '../../data/project/project.entity.js';
import { ProjectRepository } from '../../data/project/project.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { UpdateProjectUseCaseSchemaType } from './updateProject.schema.js';

export class UpdateProjectUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly projectRepository: ProjectRepository
  ) {}

  async execute({
    id,
    name,
    defaultLocale,
  }: UpdateProjectUseCaseSchemaType): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOneById(this.prisma, id);
    project.updateProject(name, defaultLocale);

    return await this.projectRepository.update(this.prisma, id, project);
  }
}
