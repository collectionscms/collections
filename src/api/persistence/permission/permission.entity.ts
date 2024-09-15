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
  user: ['readUser', 'updateUser', 'deleteUser'],
  invitation: ['inviteUser'],
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
}
