import { Experience } from '@prisma/client';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ExperienceEntity } from '../../persistence/experience/experience.entity.js';
import { ExperienceRepository } from '../../persistence/experience/experience.repository.js';
import { CreateExperienceUseCaseSchemaType } from './createExperience.useCase.schema.js';

export class CreateExperienceUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly experienceRepository: ExperienceRepository
  ) {}

  async execute(props: CreateExperienceUseCaseSchemaType): Promise<Experience[]> {
    const experienceEntities = props.experiences.map((experience) =>
      ExperienceEntity.Construct({
        projectId: props.projectId,
        name: experience.name,
        url: experience.url,
      })
    );

    await this.prisma.$transaction(async (tx) => {
      await this.experienceRepository.deleteManyByProjectId(tx, props.projectId);
      await this.experienceRepository.createMany(tx, experienceEntities);
    });

    return experienceEntities.map((experience) => experience.toPersistence());
  }
}
