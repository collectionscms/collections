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

  async deleteManyByExperienceIds(
    prisma: ProjectPrismaType,
    experienceIds: string[]
  ): Promise<void> {
    await prisma.experienceResource.deleteMany({
      where: {
        experienceId: {
          in: experienceIds.map((experienceId) => experienceId),
        },
      },
    });
  }
}
