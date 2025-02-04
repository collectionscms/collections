import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ExperienceEntity } from './experience.entity.js';
import { ExperienceRepository } from './experience.repository.js';

export class InMemoryExperienceRepository extends ExperienceRepository {
  async createMany(_prisma: ProjectPrismaType, _experiences: ExperienceEntity[]): Promise<void> {
    return;
  }

  async deleteMany(_prisma: ProjectPrismaType, _experiences: ExperienceEntity[]): Promise<void> {
    return;
  }
}
