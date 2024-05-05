import { Permission } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { PermissionEntity } from './permission.entity.js';

export class PermissionRepository {
  async findPermissions(prisma: ProjectPrismaType, roleId: string): Promise<PermissionEntity[]> {
    const records = await prisma.permission.findMany({
      where: {
        roleId,
      },
    });

    return records.map((record) =>
      PermissionEntity.Reconstruct<Permission, PermissionEntity>(record)
    );
  }
}
