import { faker } from '@faker-js/faker';
import { v4 } from 'uuid';
import { StatusType } from '../../data/post/post.entity.js';
import { BypassPrismaType } from '../prisma/client.js';
import { adminUser } from './createUsers.js';

export const createPost = async (
  prisma: BypassPrismaType,
  projectId: string,
  options?: {
    id?: string;
    slug?: string;
    status?: StatusType;
    publishedAt?: Date;
    defaultLocale?: string;
    version?: number;
    createdById?: string;
  }
): Promise<void> => {
  const currentTime = new Date();
  const title = faker.music.songName();
  const body = faker.lorem.lines(3);
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: options?.createdById ?? adminUser,
    },
  });

  await prisma.post.create({
    data: {
      id: options?.id ?? v4(),
      projectId,
      slug: options?.slug ?? faker.lorem.slug(),
      status: options?.status ?? 'published',
      publishedAt: options?.publishedAt ?? currentTime,
      defaultLocale: options?.defaultLocale ?? 'en',
      version: options?.version ?? 0,
      createdAt: currentTime,
      updatedAt: currentTime,
      createdById: user.id,
      contents: {
        create: {
          id: v4(),
          projectId,
          locale: options?.defaultLocale ?? 'en',
          title: title,
          body: body,
          // todo: add
          bodyJson: '{}',
          bodyHtml: `<p>${body}</p>`,
          createdAt: currentTime,
          updatedAt: currentTime,
        },
      },
      postHistories: {
        create: {
          id: v4(),
          projectId,
          userId: user.id,
          status: options?.status ?? 'published',
          version: options?.version ?? 0,
          createdAt: currentTime,
        },
      },
    },
  });
};
