import { Permission } from '@prisma/client';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export const roleActions = {
  post: [
    'readOwnPost',
    'readAllPost',
    'createPost',
    'updatePost',
    'trashPost',
    'publishPost',
    'archivePost',
  ],
  project: ['readProject', 'updateProject'],
  role: ['readRole', 'createRole', 'updateRole', 'deleteRole'],
  user: ['readUser', 'inviteUser', 'updateUser', 'deleteUser'],
  review: ['readOwnReview', 'readAllReview', 'createReview', 'approveReview', 'closeReview'],
  apiKey: ['readApiKey', 'createApiKey', 'updateApiKey', 'deleteApiKey'],
  webhookSetting: [
    'readWebhookSetting',
    'createWebhookSetting',
    'updateWebhookSetting',
    'deleteWebhookSetting',
  ],
  extension: ['readTemplate'],
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
