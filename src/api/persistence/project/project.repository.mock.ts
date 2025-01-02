import { BypassPrismaType, ProjectPrismaType } from '../../database/prisma/client.js';
import { buildProjectEntity } from './project.entity.fixture.js';
import { ProjectEntity } from './project.entity.js';
import { ProjectRepository } from './project.repository.js';

export class InMemoryProjectRepository extends ProjectRepository {
  async findOneBySubdomain(
    _prisma: BypassPrismaType,
    subdomain: string
  ): Promise<ProjectEntity | null> {
    return buildProjectEntity({ subdomain });
  }

  async create(_prisma: ProjectPrismaType, entity: ProjectEntity): Promise<ProjectEntity> {
    return entity;
  }
}
