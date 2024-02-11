import { Permission } from '@prisma/client';
import { PrismaType } from '../../database/prisma/client.js';

export class PermissionRepository {
  async findPermissions(prisma: PrismaType, roleId: string): Promise<Permission[]> {
    return await prisma.permission.findMany({
      where: {
        roleId,
      },
    });
  }
}
