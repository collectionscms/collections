import { Experience, ExperienceResource } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ExperienceResourceEntity } from '../experienceResource/experienceResource.entity.js';
import { ExperienceEntity } from './experience.entity.js';

export class ExperienceRepository {
  async findManyWithResources(prisma: ProjectPrismaType): Promise<
    {
      experience: ExperienceEntity;
      resources: ExperienceResourceEntity[];
    }[]
  > {
    const experiences = await prisma.experience.findMany({
      include: {
        experienceResources: true,
      },
    });

    return experiences.map((experience) => ({
      experience: ExperienceEntity.Reconstruct<Experience, ExperienceEntity>(experience),
      resources: experience.experienceResources.map((resource) =>
        ExperienceResourceEntity.Reconstruct<ExperienceResource, ExperienceResourceEntity>(resource)
      ),
    }));
  }

  async createMany(prisma: ProjectPrismaType, experiences: ExperienceEntity[]): Promise<void> {
    await prisma.experience.createMany({
      data: experiences.map((experience) => experience.toPersistence()),
    });
  }

  async deleteManyByProjectId(prisma: ProjectPrismaType, projectId: string): Promise<void> {
    await prisma.experience.deleteMany({
      where: {
        projectId,
      },
    });
  }
}
