import { Permission } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';

export class PermissionRepository {
  async findPermissions(prisma: ProjectPrismaType, roleId: string): Promise<Permission[]> {
    return await prisma.permission.findMany({
      where: {
        roleId,
      },
    });
  }
}
