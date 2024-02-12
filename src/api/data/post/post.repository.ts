import { LocalizedPost } from '../../../types/index.js';
import { PrismaType } from '../../database/prisma/client.js';
import { ContentEntity } from '../content/content.entity.js';
import { PostEntity } from './post.entity.js';

export class PostRepository {
  async findLocalizedPosts(
    prisma: PrismaType,
    projectId: string,
    locale: string
  ): Promise<LocalizedPost[]> {
    const posts = await prisma.post.findMany({
      where: {
        projectId,
      },
      include: {
        contents: {
          orderBy: {
            publishedAt: 'desc',
          },
        },
        createdBy: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts.map((post) => {
      const postEntity = PostEntity.Reconstruct(post);
      const contentEntities = post.contents.map((content) => ContentEntity.Reconstruct(content));

      return {
        ...postEntity.toLocalize(locale, contentEntities),
        authorName: post.createdBy.name,
      };
    });
  }
}
