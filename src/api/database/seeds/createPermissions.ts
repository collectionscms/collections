import { BypassPrismaType } from '../prisma/client.js';

export const createPermissions = async (prisma: BypassPrismaType): Promise<void> => {
  const postActions = [
    'readPost',
    'createPost',
    'updatePost',
    'deletePost',
    'publishPost',
    'archivePost',
  ];
  const projectActions = ['readProject', 'updateProject'];

  await prisma.permission.createMany({
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
