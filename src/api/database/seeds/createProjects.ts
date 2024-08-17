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
        subdomain: 'usa',
        sourceLanguage: 'en',
        iconUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/100px-Flag_of_the_United_States.svg.png',
        name: 'USA Project',
      },
      {
        id: jpProject,
        subdomain: 'jp',
        sourceLanguage: 'ja',
        iconUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flag_of_Japan.svg/100px-Flag_of_Japan.svg.png',
        name: 'Japan Project',
      },
    ],
  });
};
