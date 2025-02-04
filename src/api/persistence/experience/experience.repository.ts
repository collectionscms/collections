import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ExperienceEntity } from './experience.entity.js';

export class ExperienceRepository {
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
