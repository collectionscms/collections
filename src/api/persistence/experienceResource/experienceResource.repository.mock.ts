import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ExperienceResourceEntity } from './experienceResource.entity.js';
import { ExperienceResourceRepository } from './experienceResource.repository.js';

export class InMemoryExperienceResourceRepository extends ExperienceResourceRepository {
  async createMany(
    _prisma: ProjectPrismaType,
    _experiences: ExperienceResourceEntity[]
  ): Promise<void> {
    return;
  }
}
