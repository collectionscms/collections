import { v4 } from 'uuid';
import { bypassRLSPrisma } from '../prisma/client.js';

export const usProject = v4();
export const jaProject = v4();

export const createProjects = async (): Promise<void> => {
  await bypassRLSPrisma().project.createMany({
    data: [
      {
        id: usProject,
        subdomain: 'us',
        name: 'US Project',
      },
      {
        id: jaProject,
        subdomain: 'ja',
        name: 'JA Project',
      },
    ],
  });
};
