import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ExperienceResourceEntity } from './experienceResource.entity.js';

export class ExperienceResourceRepository {
  async createMany(
    prisma: ProjectPrismaType,
    experienceResources: ExperienceResourceEntity[]
  ): Promise<void> {
    await prisma.experienceResource.createMany({
      data: experienceResources.map((experienceResource) => experienceResource.toPersistence()),
    });
  }
}
