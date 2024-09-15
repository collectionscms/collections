import { v4 } from 'uuid';
import { apiKeyActions } from '../../../persistence/permission/permission.entity.js';
import { enProject, jpProject } from './projects.js';
import { adminUser } from './users.js';

export const apiKeys = [
  {
    apiKey: {
      id: v4(),
      key: 'bd7ef64b-dc9b-4d42-a486-df1ebd69fe1b',
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
      key: 'e25106cd-e059-4fe6-8213-9acb80c58c8e',
      name: 'default',
      isAdmin: false,
      projectId: jpProject,
      createdById: adminUser,
      updatedById: adminUser,
    },
    permissions: apiKeyActions.post,
  },
];
