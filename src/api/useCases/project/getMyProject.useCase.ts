import { Project } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ProjectRepository } from '../../persistence/project/project.repository.js';
import { GetMyProjectUseCaseSchemaType } from './getMyProject.schema.js';

export class GetMyProjectUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly projectRepository: ProjectRepository
  ) {}

  async execute(props: GetMyProjectUseCaseSchemaType): Promise<Project> {
    const record = await this.projectRepository.findOneById(this.prisma, props.projectId);
    return record.toResponse();
  }
}
