import { v4 } from 'uuid';
import { apiKeyActions } from '../../../persistence/permission/permission.entity.js';
import { enProject, jpProject } from './projects.js';
import { adminUser } from './users.js';

export const apiKeys = [
  {
    apiKey: {
      id: v4(),
      key: v4(),
      name: 'default',
      isAdmin: false,
      projectId: enProject,
      createdById: adminUser,
      updatedById: adminUser,
    },
    permissions: apiKeyActions.post,
  },
  {
    apiKey: {
      id: v4(),
      key: v4(),
      name: 'default',
      isAdmin: false,
      projectId: jpProject,
      createdById: adminUser,
      updatedById: adminUser,
    },
    permissions: apiKeyActions.post,
  },
];
