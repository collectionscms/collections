import { BypassPrismaType } from '../prisma/client.js';

export const createPermissions = async (prisma: BypassPrismaType): Promise<void> => {
  const actions = {
    post: ['readPost', 'createPost', 'updatePost', 'deletePost', 'publishPost', 'archivePost'],
    project: ['readProject', 'updateProject'],
    role: ['readRole', 'createRole', 'updateRole', 'deleteRole'],
    user: ['readUser', 'updateUser', 'deleteUser'],
    invitation: ['inviteUser'],
    review: ['readOwnReview', 'readAllReview', 'createReview', 'approveReview', 'closeReview'],
  };

  await prisma.permission.createMany({
    data: [
      ...Object.entries(actions).flatMap(([group, actions]) =>
        actions.map((action, i) => ({
          action,
          group,
          displayOrder: i,
        }))
      ),
    ],
  });
};
