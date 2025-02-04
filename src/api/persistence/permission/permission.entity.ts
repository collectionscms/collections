import { Permission } from '@prisma/client';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export const roleActions = {
  post: ['readOwnPost', 'readAllPost', 'savePost', 'trashPost', 'publishPost', 'archivePost'],
  project: ['readProject', 'updateProject', 'readSeo', 'saveSeo'],
  role: ['readRole', 'createRole', 'updateRole', 'deleteRole'],
  user: ['readUser', 'inviteUser', 'updateUser', 'deleteUser'],
  review: ['readOwnReview', 'readAllReview', 'approveReview', 'closeReview'],
  apiKey: ['readApiKey', 'createApiKey', 'updateApiKey', 'deleteApiKey'],
  webhookSetting: [
    'readWebhookSetting',
    'createWebhookSetting',
    'updateWebhookSetting',
    'deleteWebhookSetting',
  ],
};

export const apiKeyActions = {
  post: ['readPublishedPost'],
};

export class PermissionEntity extends PrismaBaseEntity<Permission> {
  get action(): string {
    return this.props.action;
  }

  static hasPermission = (
    permissions:
      | {
          action: string;
        }[]
      | null,
    action: string
  ) => {
    return permissions?.map((p) => p.action).includes(action) ?? false;
  };
}
