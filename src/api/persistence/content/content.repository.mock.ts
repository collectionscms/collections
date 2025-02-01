import { ProjectPrismaType } from '../../database/prisma/client.js';
import { buildUserEntity } from '../user/user.entity.fixture.js';
import { UserEntity } from '../user/user.entity.js';
import { buildContentEntity } from './content.entity.fixture.js';
import { ContentEntity } from './content.entity.js';
import { ContentRepository } from './content.repository.js';

export class InMemoryContentRepository extends ContentRepository {
  async findOneBySlug(
    _prisma: ProjectPrismaType,
    slug: string
  ): Promise<{ content: ContentEntity; createdBy: UserEntity } | null> {
    return {
      content: buildContentEntity({
        slug,
      }),
      createdBy: buildUserEntity(),
    };
  }

  async findOneByIdOrSlug(
    _prisma: ProjectPrismaType,
    identifier: string
  ): Promise<{ content: ContentEntity; createdBy: UserEntity } | null> {
    return {
      content: buildContentEntity({
        id: identifier,
      }),
      createdBy: buildUserEntity(),
    };
  }

  async findPublishedContentsByCreatedById(
    _prisma: ProjectPrismaType,
    userId: string
  ): Promise<ContentEntity[]> {
    return [
      buildContentEntity({
        createdById: userId,
      }),
    ];
  }

  async create(
    _prisma: ProjectPrismaType,
    contentEntity: ContentEntity
  ): Promise<{ content: ContentEntity; createdBy: UserEntity }> {
    return {
      content: contentEntity,
      createdBy: buildUserEntity(),
    };
  }
}
