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
        status: {
          not: 'init',
        },
      },
      include: {
        contents: true,
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
  ): Promise<{ post: PostEntity; contents: ContentEntity[]; createdBy: UserEntity }> {
    const record = await prisma.post.findFirstOrThrow({
      where: {
        id,
        projectId: projectId,
      },
      include: {
        contents: true,
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

  async update(prisma: PrismaType, postEntity: PostEntity): Promise<PostEntity> {
    console.log('更新する', postEntity.toPersistence());

    const record = await prisma.post.update({
      where: {
        id: postEntity.id(),
      },
      data: postEntity.toPersistence(),
    });

    return PostEntity.Reconstruct(record);
  }
}
