import { v4 as uuidV4 } from 'uuid';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { prisma } from '../prisma/client.js';
import { adminRoleId, editorRoleId, guestRoleId } from './createRoles.js';

export const adminUserId = '10000000-0000-0000-0000-000000000001';
export const editorUserId = '10000000-0000-0000-0000-000000000002';
export const guestUserId = '10000000-0000-0000-0000-000000000003';

export const createUsers = async (): Promise<void> => {
  const password = await oneWayHash('password');

  await prisma.user.createMany({
    data: [
      {
        id: adminUserId,
        name: 'Administrator',
        email: 'admin@collections.dev',
        password: password,
        isActive: true,
        apiKey: uuidV4(),
        roleId: adminRoleId,
      },
      {
        id: editorUserId,
        name: 'Editor',
        email: 'editor@collections.dev',
        password: password,
        isActive: true,
        apiKey: uuidV4(),
        roleId: editorRoleId,
      },
      {
        id: guestUserId,
        name: 'Guest',
        email: 'guest@collections.dev',
        password: password,
        isActive: true,
        apiKey: uuidV4(),
        roleId: guestRoleId,
      },
    ],
  });
};
