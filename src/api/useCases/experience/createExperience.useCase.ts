import { Experience } from '@prisma/client';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { ExperienceEntity } from '../../persistence/experience/experience.entity.js';
import { ExperienceRepository } from '../../persistence/experience/experience.repository.js';
import { ExperienceResourceEntity } from '../../persistence/experienceResource/experienceResource.entity.js';
import { ExperienceResourceRepository } from '../../persistence/experienceResource/experienceResource.repository.js';
import { CreateExperienceUseCaseSchemaType } from './createExperience.useCase.schema.js';

export class CreateExperienceUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly experienceRepository: ExperienceRepository,
    private readonly experienceResourceRepository: ExperienceResourceRepository
  ) {}

  async execute({
    projectId,
    experiences,
  }: CreateExperienceUseCaseSchemaType): Promise<Experience[]> {
    const experiencesWithResources = await this.experienceRepository.findManyWithResources(
      this.prisma
    );

    // new experiences
    const newExperienceWithResources = experiences
      .filter((experience) => !experience.id)
      .map((experience) => {
        return ExperienceEntity.Construct({
          projectId,
          name: experience.name,
          url: experience.url,
          resourceUrls: experience.resourceUrls.filter((resourceUrl) => resourceUrl !== null),
        });
      });

    // delete experiences
    const deleteExperiences = experiencesWithResources
      .filter(
        (experience) =>
          !experiences.some((newExperience) => newExperience.id === experience.experience.id)
      )
      .map((experience) => experience.experience);

    // update experiences
    const updateExperienceWithResources = experiencesWithResources.flatMap(
      (experiencesWithResource) => {
        const entryExperience = experiences.find(
          (newExperience) => newExperience.id === experiencesWithResource.experience.id
        );
        if (!entryExperience) return [];

        experiencesWithResource.experience.updateExperience({
          name: entryExperience.name,
          url: entryExperience.url,
        });

        return {
          experience: experiencesWithResource.experience,
          resources: entryExperience.resourceUrls
            .filter((resourceUrl) => resourceUrl !== null)
            .map((resourceUrl) =>
              ExperienceResourceEntity.Construct({
                projectId,
                experienceId: experiencesWithResource.experience.id,
                url: resourceUrl,
              })
            ),
        };
      }
    );

    await this.prisma.$transaction(async (tx) => {
      // /////////////////////////////////////
      // Delete
      // /////////////////////////////////////

      if (deleteExperiences.length > 0) {
        await this.experienceRepository.deleteManyById(tx, deleteExperiences);
      }

      // /////////////////////////////////////
      // Update
      // /////////////////////////////////////

      const updateExperiences = updateExperienceWithResources.map(
        (updateExperienceWithResource) => updateExperienceWithResource.experience
      );

      for (const updateExperience of updateExperiences) {
        await this.experienceRepository.update(tx, updateExperience);
      }

      // delete and create experience resources
      if (updateExperiences.length > 0) {
        await this.experienceResourceRepository.deleteManyByExperienceIds(
          tx,
          updateExperiences.map((updateExperience) => updateExperience.id)
        );
      }

      await this.experienceResourceRepository.createMany(
        tx,
        updateExperienceWithResources.flatMap(
          (experienceWithResource) => experienceWithResource.resources
        )
      );

      // /////////////////////////////////////
      // Create
      // /////////////////////////////////////

      await this.experienceRepository.createMany(
        tx,
        newExperienceWithResources.map(
          (experienceWithResource) => experienceWithResource.experience
        )
      );

      await this.experienceResourceRepository.createMany(
        tx,
        newExperienceWithResources.flatMap(
          (experienceWithResource) => experienceWithResource.experienceResources
        )
      );
    });

    return newExperienceWithResources.map((experienceWithResource) =>
      experienceWithResource.experience.toWithResourcesResponse(
        experienceWithResource.experienceResources
      )
    );
  }
}
