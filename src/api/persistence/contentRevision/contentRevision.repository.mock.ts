import { ProjectPrismaType } from '../../database/prisma/client.js';
import { buildContentRevisionEntity } from './contentRevision.entity.fixture.js';
import { ContentRevisionEntity } from './contentRevision.entity.js';
import { ContentRevisionRepository } from './contentRevision.repository.js';

export class InMemoryContentRevisionRepository extends ContentRevisionRepository {
  async findLatestOneBySlug(
    _prisma: ProjectPrismaType,
    slug: string
  ): Promise<ContentRevisionEntity | null> {
    return buildContentRevisionEntity({
      slug,
    });
  }

  async findLatestOneByContentIdOrSlug(
    _prisma: ProjectPrismaType,
    identifier: string
  ): Promise<ContentRevisionEntity | null> {
    return buildContentRevisionEntity({
      contentId: identifier,
    });
  }

  async findLatestOneByContentId(
    _prisma: ProjectPrismaType,
    contentId: string
  ): Promise<ContentRevisionEntity | null> {
    return buildContentRevisionEntity({
      contentId,
    });
  }

  async create(
    _prisma: ProjectPrismaType,
    entity: ContentRevisionEntity
  ): Promise<ContentRevisionEntity> {
    return entity;
  }

  async update(
    _prisma: ProjectPrismaType,
    entity: ContentRevisionEntity
  ): Promise<ContentRevisionEntity> {
    return entity;
  }
}
