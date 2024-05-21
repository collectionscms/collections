import { v4 } from 'uuid';
import { BypassPrismaType } from '../prisma/client.js';

export const enProject = v4();
export const jaProject = v4();

export const createProjects = async (prisma: BypassPrismaType): Promise<void> => {
  await prisma.project.createMany({
    data: [
      {
        id: enProject,
        subdomain: 'en',
        name: 'EN Project',
      },
      {
        id: jaProject,
        subdomain: 'ja',
        name: 'JA Project',
      },
    ],
  });
};
