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

  async findOneById(
    prisma: PrismaType,
    projectId: string,
    id: string
  ): Promise<{ post: PostEntity; contents: ContentEntity[]; createdBy: UserEntity }> {
    const record = await prisma.post.findFirstOrThrow({
      where: {
        id,
        projectId: projectId,
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

    const post = PostEntity.Reconstruct(record);
    const contents = record.contents.map((content) => ContentEntity.Reconstruct(content));
    const createdBy = UserEntity.Reconstruct(record.createdBy);

    return {
      post,
      contents,
      createdBy,
    };
  }

  async findInit(
    prisma: PrismaType,
    projectId: string,
    userId: string
  ): Promise<{ post: PostEntity; contents: ContentEntity[]; createdBy: UserEntity } | null> {
    const record = await prisma.post.findFirst({
      where: {
        projectId,
        createdById: userId,
        status: 'init',
      },
      include: {
        contents: true,
        createdBy: true,
      },
    });

    if (!record) return null;

    const post = PostEntity.Reconstruct(record);
    const contents = record.contents.map((content) => ContentEntity.Reconstruct(content));
    const createdBy = UserEntity.Reconstruct(record.createdBy);

    return {
      post,
      contents,
      createdBy,
    };
  }

  async create(
    prisma: PrismaType,
    postEntity: PostEntity
  ): Promise<{ post: PostEntity; createdBy: UserEntity }> {
    const record = await prisma.post.create({
      data: postEntity.toPersistence(),
      include: {
        createdBy: true,
      },
    });

    return {
      post: postEntity,
      createdBy: UserEntity.Reconstruct(record.createdBy),
    };
  }
}
