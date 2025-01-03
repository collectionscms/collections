import { ProjectPrismaType } from '../../database/prisma/client.js';
import { buildContentEntity } from '../content/content.entity.fixture.js';
import { ContentEntity } from '../content/content.entity.js';
import { buildTagEntity } from '../tag/tag.entity.fixture.js';
import { TagEntity } from '../tag/tag.entity.js';
import { buildUserEntity } from '../user/user.entity.fixture.js';
import { UserEntity } from '../user/user.entity.js';
import { ContentTagRepository } from './contentTag.repository.js';

export class InMemoryContentTagRepository extends ContentTagRepository {
  async findPublishedContentsByTagId(
    _prisma: ProjectPrismaType,
    _tagId: string
  ): Promise<{ content: ContentEntity; createdBy: UserEntity }[]> {
    return [
      { content: buildContentEntity(), createdBy: buildUserEntity() },
      { content: buildContentEntity(), createdBy: buildUserEntity() },
    ];
  }

  async findTagsByContentId(_prisma: ProjectPrismaType, _contentId: string): Promise<TagEntity[]> {
    return [buildTagEntity()];
  }
}
