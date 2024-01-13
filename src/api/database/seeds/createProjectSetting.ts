import { prisma } from '../prisma/client.js';

export const createProjectSetting = async (): Promise<void> => {
  await prisma.projectSetting.create({
    data: {
      name: 'Collections',
    },
  });
};
