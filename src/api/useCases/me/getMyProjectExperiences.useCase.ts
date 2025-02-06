import { ProjectWithExperiences } from '../../../types/index.js';
import { BypassPrismaType } from '../../database/prisma/client.js';
import { UserProjectRepository } from '../../persistence/userProject/userProject.repository.js';
import { GetMyProjectExperiencesUseCaseSchemaType } from './getMyProjectExperiences.useCase.schema.js';

export class GetMyProjectExperiencesUseCase {
  constructor(
    private readonly prisma: BypassPrismaType,
    private readonly userProjectRepository: UserProjectRepository
  ) {}

  async execute(
    props: GetMyProjectExperiencesUseCaseSchemaType
  ): Promise<ProjectWithExperiences[]> {
    const result = await this.userProjectRepository.findManyWithProjectExperiencesByUserId(
      this.prisma,
      props.userId
    );

    return result.map((record) => ({
      ...record.project.toResponse(),
      experiences: record.experiences.map((experience) => experience.toResponse()),
    }));
  }
}
