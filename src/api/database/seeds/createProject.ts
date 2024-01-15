import { prisma } from '../prisma/client.js';

export const globalProject = '10000000-1000-0000-0000-000000000001';

export const createProjects = async (): Promise<void> => {
  await prisma.project.createMany({
    data: [
      {
        id: globalProject,
        slug: 'global',
        name: 'global-project',
      },
    ],
  });
};
