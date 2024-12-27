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
    return Promise.resolve({
      content: buildContentEntity({
        slug,
      }),
      createdBy: buildUserEntity(),
    });
  }
}
