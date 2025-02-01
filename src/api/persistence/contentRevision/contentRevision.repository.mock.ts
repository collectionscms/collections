import { ProjectPrismaType } from '../../database/prisma/client.js';
import { buildUserEntity } from '../user/user.entity.fixture.js';
import { UserEntity } from '../user/user.entity.js';
import { buildContentRevisionEntity } from './contentRevision.entity.fixture.js';
import { ContentRevisionEntity } from './contentRevision.entity.js';
import { ContentRevisionRepository } from './contentRevision.repository.js';

export class InMemoryContentRevisionRepository extends ContentRevisionRepository {
  async findLatestOneBySlug(
    _prisma: ProjectPrismaType,
    slug: string
  ): Promise<{ contentRevision: ContentRevisionEntity; createdBy: UserEntity } | null> {
    return {
      contentRevision: buildContentRevisionEntity({
        slug,
      }),
      createdBy: buildUserEntity(),
    };
  }

  async findLatestOneByContentIdOrSlug(
    _prisma: ProjectPrismaType,
    identifier: string
  ): Promise<{ contentRevision: ContentRevisionEntity; createdBy: UserEntity } | null> {
    return {
      contentRevision: buildContentRevisionEntity({
        contentId: identifier,
      }),
      createdBy: buildUserEntity(),
    };
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
