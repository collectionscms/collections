import { prisma } from '../prisma/client.js';

export const globalOrganization = '10000000-0000-0000-0000-000000000001';

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
