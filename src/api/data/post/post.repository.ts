import { User } from '@auth/express';
import { Content, ContentHistory, File, Post } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { ContentEntity } from '../content/content.entity.js';
import { ContentHistoryEntity } from '../contentHistory/contentHistory.entity.js';
import { FileEntity } from '../file/file.entity.js';
import { UserEntity } from '../user/user.entity.js';
import { PostEntity } from './post.entity.js';

export class PostRepository {
  async findManyByProjectId(prisma: ProjectPrismaType): Promise<
    {
      post: PostEntity;
      contents: {
        content: ContentEntity;
        file: FileEntity | null;
        updatedBy: UserEntity;
        histories: ContentHistoryEntity[];
      }[];
    }[]
  > {
    const records = await prisma.post.findMany({
      include: {
        contents: {
          include: {
            file: true,
            updatedBy: true,
            contentHistories: true,
          },
          where: {
            status: {
              not: 'trashed',
            },
          },
        },
      },
      where: {
        status: {
          not: 'trashed',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => {
      const post = PostEntity.Reconstruct<Post, PostEntity>(record);
      const contents = [];
      for (const content of record.contents) {
        contents.push({
          content: ContentEntity.Reconstruct<Content, ContentEntity>(content),
          file: content.file ? FileEntity.Reconstruct<File, FileEntity>(content.file) : null,
          updatedBy: UserEntity.Reconstruct<User, UserEntity>(content.updatedBy),
          histories: content.contentHistories.map((history) =>
            ContentHistoryEntity.Reconstruct<ContentHistory, ContentHistoryEntity>(history)
          ),
        });
      }

      return {
        post,
        contents,
      };
    });
  }

  async findOneById(prisma: ProjectPrismaType, id: string): Promise<PostEntity> {
    const record = await prisma.post.findFirstOrThrow({
      where: {
        id,
      },
    });

    return PostEntity.Reconstruct<Post, PostEntity>(record);
  }

  async findOneWithContentsById(
    prisma: ProjectPrismaType,
    id: string
  ): Promise<{
    post: PostEntity;
    contents: {
      content: ContentEntity;
      file: FileEntity | null;
      createdBy: UserEntity;
      histories: ContentHistoryEntity[];
    }[];
  }> {
    const record = await prisma.post.findFirstOrThrow({
      where: {
        id,
      },
      include: {
        contents: {
          include: {
            file: true,
            createdBy: true,
            contentHistories: true,
          },
          where: {
            status: {
              not: 'trashed',
            },
          },
          orderBy: {
            version: 'desc',
          },
        },
      },
    });

    const post = PostEntity.Reconstruct<Post, PostEntity>(record);
    const contents = [];
    for (const content of record.contents) {
      contents.push({
        content: ContentEntity.Reconstruct<Content, ContentEntity>(content),
        file: content.file ? FileEntity.Reconstruct<File, FileEntity>(content.file) : null,
        createdBy: UserEntity.Reconstruct<User, UserEntity>(content.createdBy),
        histories: content.contentHistories.map((history) =>
          ContentHistoryEntity.Reconstruct<ContentHistory, ContentHistoryEntity>(history)
        ),
      });
    }

    return {
      post,
      contents,
    };
  }

  async findManyTrashedByProjectId(prisma: ProjectPrismaType): Promise<
    {
      post: PostEntity;
      contents: {
        content: ContentEntity;
      }[];
    }[]
  > {
    const records = await prisma.post.findMany({
      include: {
        contents: {
          where: {
            status: {
              not: 'trashed',
            },
          },
        },
      },
      where: {
        status: 'trashed',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => {
      const post = PostEntity.Reconstruct<Post, PostEntity>(record);
      const contents = [];
      for (const content of record.contents) {
        contents.push({
          content: ContentEntity.Reconstruct<Content, ContentEntity>(content),
        });
      }

      return {
        post,
        contents,
      };
    });
  }

  async create(prisma: ProjectPrismaType, postEntity: PostEntity): Promise<PostEntity> {
    const record = await prisma.post.create({
      data: postEntity.toPersistence(),
    });

    return PostEntity.Reconstruct<Post, PostEntity>(record);
  }

  async updateStatus(prisma: ProjectPrismaType, postEntity: PostEntity): Promise<PostEntity> {
    const record = await prisma.post.update({
      where: {
        id: postEntity.id,
      },
      data: {
        status: postEntity.status,
      },
    });

    return PostEntity.Reconstruct<Post, PostEntity>(record);
  }
}
