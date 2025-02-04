import { Experience } from '@prisma/client';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ExperienceEntity } from '../../persistence/experience/experience.entity.js';
import { ExperienceRepository } from '../../persistence/experience/experience.repository.js';
import { ExperienceResourceRepository } from '../../persistence/experienceResource/experienceResource.repository.js';
import { CreateExperienceUseCaseSchemaType } from './createExperience.useCase.schema.js';

export class CreateExperienceUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly experienceRepository: ExperienceRepository,
    private readonly experienceResourceRepository: ExperienceResourceRepository
  ) {}

  async execute(props: CreateExperienceUseCaseSchemaType): Promise<Experience[]> {
    const experienceWithResources = props.experiences.map((experience) => {
      return ExperienceEntity.Construct({
        projectId: props.projectId,
        name: experience.name,
        url: experience.url,
        resourceUrls: experience.resourceUrls.filter((resourceUrl) => resourceUrl !== null),
      });
    });

    await this.prisma.$transaction(async (tx) => {
      await this.experienceRepository.deleteManyByProjectId(tx, props.projectId);
      await this.experienceRepository.createMany(
        tx,
        experienceWithResources.map((experienceWithResource) => experienceWithResource.experience)
      );
      await this.experienceResourceRepository.createMany(
        tx,
        experienceWithResources.flatMap(
          (experienceWithResource) => experienceWithResource.experienceResources
        )
      );
    });

    return experienceWithResources.map((experienceWithResource) =>
      experienceWithResource.experience.toWithResourcesResponse(
        experienceWithResource.experienceResources
      )
    );
  }
}
