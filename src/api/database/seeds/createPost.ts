import { v4 } from 'uuid';
import { contentStatus } from '../../data/content/content.entity.js';
import { BypassPrismaType } from '../prisma/client.js';
import { adminUser } from './createUsers.js';

export const createPost = async (
  prisma: BypassPrismaType,
  projectId: string,
  slug: string,
  contents: {
    language: string;
    title: string;
    body: string;
    bodyJson: string;
    bodyHtml: string;
    status: string;
  }[],
  options?: {
    postId?: string;
    createdById?: string;
  }
): Promise<void> => {
  const currentTime = new Date();
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: options?.createdById ?? adminUser,
    },
  });
  const postId = options?.postId ?? v4();

  const postContents = [];
  const postContentHistories = [];
  for (const content of contents) {
    postContents.push({
      id: v4(),
      projectId,
      status: content.status,
      publishedAt: content.status === contentStatus.published ? currentTime : null,
      language: content.language,
      version: 1,
      title: content.title,
      body: content.body,
      bodyJson: content.bodyJson,
      bodyHtml: content.bodyHtml,
      createdById: user.id,
      updatedById: user.id,
      createdAt: currentTime,
      updatedAt: currentTime,
    });

    postContentHistories.push({
      id: v4(),
      projectId,
      createdById: user.id,
      updatedById: user.id,
      status: content.status,
      language: content.language,
      version: 1,
      createdAt: currentTime,
    });
  }

  await prisma.post.create({
    data: {
      id: postId,
      projectId,
      slug: slug,
      createdById: user.id,
      createdAt: currentTime,
      updatedAt: currentTime,
      contents: {
        create: postContents,
      },
      contentHistories: {
        create: postContentHistories,
      },
    },
  });
};
