import { v4 } from 'uuid';
import { BypassPrismaType } from '../prisma/client.js';
import { enProject, jaProject } from './createProjects.js';

export const enAdminRole = v4();
export const enEditorRole = v4();
export const enContributorRole = v4();
export const enViewerRole = v4();
export const jaAdminRole = v4();
export const jaEditorRole = v4();
export const jaContributorRole = v4();
export const jaViewerRole = v4();

export const createRoles = async (prisma: BypassPrismaType): Promise<void> => {
  const editorPermissions = [
    'readPost',
    'createPost',
    'updatePost',
    'deletePost',
    'publishPost',
    'archivePost',
    'readProject',
    'readRole',
    'createRole',
    'readUser',
    'inviteUser',
  ];

  const contributorPermissions = [
    'readPost',
    'createPost',
    'updatePost',
    'publishPost',
    'readProject',
    'readRole',
    'readUser',
  ];

  const enProjectRoles = [
    {
      id: enAdminRole,
      name: 'Administrator',
      description: 'Administrator role with all permissions.',
      isAdmin: true,
      projectId: enProject,
      permissions: [],
    },
    {
      id: enEditorRole,
      name: 'Editor',
      description: 'Editor role with permission to edit and publish posts.',
      isAdmin: false,
      projectId: enProject,
      permissions: editorPermissions,
    },
    {
      id: enContributorRole,
      name: 'ContributorRole',
      description: 'ContributorRole role with permission to create posts.',
      isAdmin: false,
      projectId: enProject,
      permissions: contributorPermissions,
    },
    {
      id: enViewerRole,
      name: 'Viewer',
      description: 'Viewer role with permission to read posts.',
      isAdmin: false,
      projectId: enProject,
      permissions: ['readPost'],
    },
  ];

  const jaProjectRoles = [
    {
      id: jaAdminRole,
      name: '管理者',
      description: 'すべての権限をもつ管理者ロール',
      isAdmin: true,
      projectId: jaProject,
      permissions: [],
    },
    {
      id: jaEditorRole,
      name: 'エディター',
      description: '記事の編集・公開権限をもつ編集者ロール',
      isAdmin: false,
      projectId: jaProject,
      permissions: editorPermissions,
    },
    {
      id: jaContributorRole,
      name: '投稿者',
      description: '記事の作成権限をもつ投稿者ロール',
      isAdmin: false,
      projectId: jaProject,
      permissions: contributorPermissions,
    },
    {
      id: jaViewerRole,
      name: 'ビューアー',
      description: '記事の閲覧権限をもつビューアーロール',
      isAdmin: false,
      projectId: jaProject,
      permissions: ['readPost'],
    },
  ];

  for (const role of [...enProjectRoles, ...jaProjectRoles]) {
    await prisma.role.create({
      data: {
        id: role.id,
        name: role.name,
        description: role.description,
        isAdmin: role.isAdmin,
        projectId: role.projectId,
        rolePermissions: {
          create: role.permissions.map((permission) => ({
            id: v4(),
            projectId: role.projectId,
            permissionAction: permission,
          })),
        },
      },
    });
  }
};
