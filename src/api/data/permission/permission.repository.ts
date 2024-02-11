import { Permission } from '@prisma/client';
import { prismaType } from '../../database/prisma/client.js';

export class PermissionRepository {
  async findPermissions(prisma: prismaType, roleId: string): Promise<Permission[]> {
    return await prisma.permission.findMany({
      where: {
        roleId,
      },
    });
  }
}
