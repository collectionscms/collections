/* eslint-disable max-len */
import { v4 } from 'uuid';
import { BypassPrismaType } from '../prisma/client.js';

export const usaProject = v4();
export const jpProject = v4();

export const createProjects = async (prisma: BypassPrismaType): Promise<void> => {
  await prisma.project.createMany({
    data: [
      {
        id: usaProject,
        subdomain: 'en',
        sourceLanguage: 'en-us',
        iconUrl: null,
        name: 'EN Project',
      },
      {
        id: jpProject,
        subdomain: 'ja',
        sourceLanguage: 'ja',
        iconUrl: null,
        name: 'JA Project',
      },
    ],
  });
};
