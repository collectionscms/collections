import { faker } from '@faker-js/faker';
import { v4 } from 'uuid';
import { prisma } from '../prisma/client.js';
import { globalProject } from './createProjects.js';
import { adminUser } from './createUsers.js';

export const createPost = async (options?: {
  id?: string;
  projectId?: string;
  slug?: string;
  status?: string;
  publishedAt?: Date;
  defaultLocale?: string;
  version?: number;
  createdById?: string;
}): Promise<void> => {
  const currentTime = new Date();
  const title = faker.music.songName();
  const body = faker.lorem.lines(3);

  await prisma.post.create({
    data: {
      id: options?.id ?? v4(),
      projectId: options?.projectId ?? globalProject,
      slug: options?.slug ?? faker.lorem.slug(),
      status: options?.status ?? 'published',
      publishedAt: options?.publishedAt ?? currentTime,
      defaultLocale: options?.defaultLocale ?? 'ja',
      version: options?.version ?? 0,
      createdAt: currentTime,
      updatedAt: currentTime,
      createdById: options?.createdById ?? adminUser,
      contents: {
        create: {
          id: v4(),
          projectId: options?.projectId ?? globalProject,
          locale: options?.defaultLocale ?? 'ja',
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
          createdById: options?.createdById ?? adminUser,
          action: 'created',
          version: options?.version ?? 0,
          createdAt: currentTime,
        },
      },
    },
  });
};
