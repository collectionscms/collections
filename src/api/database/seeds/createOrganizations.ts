import { v4 } from 'uuid';
import { prisma } from '../prisma/client.js';

export const globalOrganization = v4();

export const createOrganizations = async (): Promise<void> => {
  await prisma.organization.createMany({
    data: [
      {
        id: globalOrganization,
        name: 'Global Organization',
      },
    ],
  });
};
