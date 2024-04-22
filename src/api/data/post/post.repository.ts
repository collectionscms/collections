import { PrismaType } from '../../database/prisma/client.js';
import { ContentEntity } from '../content/content.entity.js';
import { FileEntity } from '../file/file.entity.js';
import { PostHistoryEntity } from '../postHistory/postHistory.entity.js';
import { UserEntity } from '../user/user.entity.js';
import { PostEntity } from './post.entity.js';

export class PostRepository {
  async findManyByProjectId(
    prisma: PrismaType,
    projectId: string
  ): Promise<
    {
      post: PostEntity;
      contents: { content: ContentEntity; file: FileEntity | null }[];
      histories: PostHistoryEntity[];
      createdBy: UserEntity;
    }[]
  > {
    const records = await prisma.post.findMany({
      where: {
        projectId,
        status: {
          not: 'init',
        },
      },
      include: {
        contents: {
          include: {
            file: true,
          },
        },
        createdBy: true,
        postHistories: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => {
      const post = PostEntity.Reconstruct(record);
      const contents = [];
      for (const content of record.contents) {
        contents.push({
          content: ContentEntity.Reconstruct(content),
          file: content.file ? FileEntity.Reconstruct(content.file) : null,
        });
      }
      const histories = record.postHistories.map((history) =>
        PostHistoryEntity.Reconstruct(history)
      );
      const createdBy = UserEntity.Reconstruct(record.createdBy);

      return {
        post,
        contents,
        histories,
        createdBy,
      };
    });
  }

  async findOneById(prisma: PrismaType, projectId: string, id: string): Promise<PostEntity> {
    const record = await prisma.post.findFirstOrThrow({
      where: {
        id,
        projectId,
      },
    });

    return PostEntity.Reconstruct(record);
  }

  async findOneWithContentsById(
    prisma: PrismaType,
    projectId: string,
    id: string
  ): Promise<{
    post: PostEntity;
    contents: { content: ContentEntity; file: FileEntity | null }[];
    histories: PostHistoryEntity[];
    createdBy: UserEntity;
  }> {
    const record = await prisma.post.findFirstOrThrow({
      where: {
        id,
        projectId,
      },
      include: {
        contents: {
          include: {
            file: true,
          },
        },
        createdBy: true,
        postHistories: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const post = PostEntity.Reconstruct(record);
    const contents = [];
    for (const content of record.contents) {
      contents.push({
        content: ContentEntity.Reconstruct(content),
        file: content.file ? FileEntity.Reconstruct(content.file) : null,
      });
    }
    const histories = record.postHistories.map((history) => PostHistoryEntity.Reconstruct(history));
    const createdBy = UserEntity.Reconstruct(record.createdBy);

    return {
      post,
      contents,
      histories,
      createdBy,
    };
  }

  async findInitByUserId(
    prisma: PrismaType,
    projectId: string,
    userId: string
  ): Promise<{
    post: PostEntity;
    contents: { content: ContentEntity; file: FileEntity | null }[];
    createdBy: UserEntity;
  } | null> {
    const record = await prisma.post.findFirst({
      where: {
        projectId,
        createdById: userId,
        status: 'init',
      },
      include: {
        contents: {
          include: {
            file: true,
          },
        },
        createdBy: true,
      },
    });

    if (!record) return null;

    const post = PostEntity.Reconstruct(record);
    const contents = [];
    for (const content of record.contents) {
      contents.push({
        content: ContentEntity.Reconstruct(content),
        file: content.file ? FileEntity.Reconstruct(content.file) : null,
      });
    }
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

  async update(prisma: PrismaType, projectId: string, postEntity: PostEntity): Promise<PostEntity> {
    const record = await prisma.post.update({
      where: {
        id: postEntity.id(),
        projectId,
      },
      data: postEntity.toPersistence(),
    });

    return PostEntity.Reconstruct(record);
  }

  async delete(prisma: PrismaType, projectId: string, id: string): Promise<PostEntity> {
    const record = await prisma.post.delete({
      where: {
        id,
        projectId,
      },
    });

    return PostEntity.Reconstruct(record);
  }
}
