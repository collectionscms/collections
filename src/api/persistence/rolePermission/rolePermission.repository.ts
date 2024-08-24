import { ProjectPrismaType } from '../../database/prisma/client.js';
import { RolePermissionEntity } from './rolePermission.entity.js';

export class RolePermissionRepository {
  async createMany(
    prisma: ProjectPrismaType,
    entities: RolePermissionEntity[]
  ): Promise<RolePermissionEntity[]> {
    for (const entity of entities) {
      entity.beforeInsertValidate();
    }

    await prisma.rolePermission.createMany({
      data: entities.map((entity) => entity.toPersistence()),
    });
    return entities;
  }

  async deleteManyByRoleId(prisma: ProjectPrismaType, roleId: string): Promise<void> {
    await prisma.rolePermission.deleteMany({
      where: {
        roleId,
      },
    });
  }
}
