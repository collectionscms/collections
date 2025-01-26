import { ProjectPrismaType } from '../../database/prisma/client.js';
import { buildContentEntity } from '../content/content.entity.fixture.js';
import { ContentEntity } from '../content/content.entity.js';
import { buildContentRevisionEntity } from '../contentRevision/contentRevision.entity.fixture.js';
import { ContentRevisionEntity } from '../contentRevision/contentRevision.entity.js';
import { buildPostEntity } from './post.entity.fixture.js';
import { PostEntity } from './post.entity.js';
import { PostRepository } from './post.repository.js';

export class InMemoryPostRepository extends PostRepository {
  async findOneById(_prisma: ProjectPrismaType, id: string): Promise<PostEntity | null> {
    return buildPostEntity({
      id,
    });
  }

  async findOneByIsInit(_prisma: ProjectPrismaType): Promise<{
    post: PostEntity;
    content: ContentEntity;
    revision: ContentRevisionEntity;
  } | null> {
    return {
      post: buildPostEntity({
        isInit: false,
      }),
      content: buildContentEntity({}),
      revision: buildContentRevisionEntity({}),
    };
  }

  async update(_prisma: ProjectPrismaType, post: PostEntity): Promise<PostEntity> {
    return post;
  }
}
