import { PrismaType } from '../../database/prisma/client.js';
import { ContentEntity } from '../content/content.entity.js';
import { UserEntity } from '../user/user.entity.js';
import { PostEntity } from './post.entity.js';

export class PostRepository {
  async findManyByProjectId(
    prisma: PrismaType,
    projectId: string
  ): Promise<{ post: PostEntity; contents: ContentEntity[]; createdBy: UserEntity }[]> {
    const records = await prisma.post.findMany({
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

    return records.map((record) => {
      const post = PostEntity.Reconstruct(record);
      const contents = record.contents.map((content) => ContentEntity.Reconstruct(content));
      const createdBy = UserEntity.Reconstruct(record.createdBy);

      return {
        post,
        contents,
        createdBy,
      };
    });
  }
}
