import { ProjectPrismaType } from '../../database/prisma/client.js';
import { buildExperienceResourceEntity } from '../experienceResource/experienceResource.entity.fixture.js';
import { ExperienceResourceEntity } from '../experienceResource/experienceResource.entity.js';
import { buildExperienceEntity } from './experience.entity.fixture.js';
import { ExperienceEntity } from './experience.entity.js';
import { ExperienceRepository } from './experience.repository.js';

export class InMemoryExperienceRepository extends ExperienceRepository {
  async findManyWithResources(_prisma: ProjectPrismaType): Promise<
    {
      experience: ExperienceEntity;
      resources: ExperienceResourceEntity[];
    }[]
  > {
    return [{ experience: buildExperienceEntity(), resources: [buildExperienceResourceEntity()] }];
  }

  async createMany(_prisma: ProjectPrismaType, _experiences: ExperienceEntity[]): Promise<void> {
    return;
  }

  async update(
    _prisma: ProjectPrismaType,
    experience: ExperienceEntity
  ): Promise<ExperienceEntity> {
    return experience;
  }

  async deleteManyById(
    _prisma: ProjectPrismaType,
    _experiences: ExperienceEntity[]
  ): Promise<void> {
    return;
  }
}
