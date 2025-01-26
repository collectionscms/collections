import { ProjectPrismaType } from '../../database/prisma/client.js';
import { buildPostEntity } from './post.entity.fixture.js';
import { PostEntity } from './post.entity.js';
import { PostRepository } from './post.repository.js';

export class InMemoryPostRepository extends PostRepository {
  async findOneById(_prisma: ProjectPrismaType, id: string): Promise<PostEntity | null> {
    return buildPostEntity({
      id,
    });
  }

  async update(_prisma: ProjectPrismaType, post: PostEntity): Promise<PostEntity> {
    return post;
  }
}
