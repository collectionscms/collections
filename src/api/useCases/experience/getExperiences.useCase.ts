import { ExperienceWithResourceUrl } from '../../../types/index.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ExperienceRepository } from '../../persistence/experience/experience.repository.js';

export class GetExperiencesUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly experienceRepository: ExperienceRepository
  ) {}

  async execute(): Promise<ExperienceWithResourceUrl[]> {
    const experienceWithResources = await this.experienceRepository.findManyWithResources(
      this.prisma
    );

    return experienceWithResources.map((experienceWithResource) =>
      experienceWithResource.experience.toWithResourcesResponse(experienceWithResource.resources)
    );
  }
}
