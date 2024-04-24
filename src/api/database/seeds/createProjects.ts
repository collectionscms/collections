import { v4 } from 'uuid';
import { prisma } from '../prisma/client.js';
import { globalOrganization } from './createOrganizations.js';

export const usProject = v4();
export const jaProject = v4();

export const createProjects = async (): Promise<void> => {
  await prisma.project.createMany({
    data: [
      {
        id: usProject,
        organizationId: globalOrganization,
        slug: 'us',
        name: 'US Project',
      },
      {
        id: jaProject,
        organizationId: globalOrganization,
        slug: 'ja',
        name: 'JA Project',
      },
    ],
  });
};
