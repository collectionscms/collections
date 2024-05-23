import { BypassPrismaType } from '../prisma/client.js';

export const createAccess = async (prisma: BypassPrismaType): Promise<void> => {
  const postActions = [
    'readPost',
    'createPost',
    'updatePost',
    'deletePost',
    'publishPost',
    'archivePost',
  ];
  const projectActions = ['readProject', 'updateProject'];

  await prisma.access.createMany({
    data: [
      // post
      ...postActions.map((action, i) => ({
        action,
        group: 'post',
        displayOrder: i,
      })),

      // project
      ...projectActions.map((action, i) => ({
        action,
        group: 'project',
        displayOrder: i,
      })),
    ],
  });
};
