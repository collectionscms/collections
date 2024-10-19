import { v4 } from 'uuid';
import { roleActions } from '../../../persistence/permission/permission.entity.js';
import { enProject, jpProject } from './projects.js';

export const projectRoles = {
  [enProject]: {
    language: 'en-us',
    admin: v4(),
    editor: v4(),
    writer: v4(),
    viewer: v4(),
  },
  [jpProject]: {
    language: 'ja',
    admin: v4(),
    editor: v4(),
    writer: v4(),
    viewer: v4(),
  },
};

export const editorPermissions = [
  ...roleActions.post,
  'readProject',
  'readRole',
  'createRole',
  'readUser',
  'inviteUser',
  ...roleActions.review,
  'createApiKey',
  'readApiKey',
  ...roleActions.webhookSetting,
];

export const writerPermissions = [
  'readOwnPost',
  'createPost',
  'updatePost',
  'publishPost',
  'readProject',
  'readRole',
  'readUser',
  'readOwnReview',
  'closeReview',
];

export const viewerPermissions = ['readOwnPost'];
