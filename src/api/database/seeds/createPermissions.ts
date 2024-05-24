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
  const roleActions = ['readRole', 'createRole', 'updateRole', 'deleteRole'];
  const userActions = ['readUser', 'updateUser', 'deleteUser'];
  const invitationActions = ['inviteUser'];

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

      // role
      ...roleActions.map((action, i) => ({
        action,
        group: 'role',
        displayOrder: i,
      })),

      // user
      ...userActions.map((action, i) => ({
        action,
        group: 'user',
        displayOrder: i,
      })),

      // invitation
      ...invitationActions.map((action, i) => ({
        action,
        group: 'invitation',
        displayOrder: i,
      })),
    ],
  });
};
