import { Permission, Role } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { PermissionEntity } from '../permission/permission.entity.js';
import { RoleEntity } from './role.entity.js';

export class RoleRepository {
  async findMany(prisma: ProjectPrismaType): Promise<RoleEntity[]> {
    const records = await prisma.role.findMany();
    return records.map((record) => RoleEntity.Reconstruct<Role, RoleEntity>(record));
  }

  async findOne(prisma: ProjectPrismaType, id: string): Promise<RoleEntity> {
    const record = await prisma.role.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return RoleEntity.Reconstruct<Role, RoleEntity>(record);
  }

  async findOneWithPermissions(
    prisma: ProjectPrismaType,
    id: string
  ): Promise<{
    role: RoleEntity;
    permissions: PermissionEntity[];
  }> {
    const records = await prisma.role.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        rolePermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return {
      role: RoleEntity.Reconstruct<Role, RoleEntity>(records),
      permissions: records.rolePermissions.map((rolePermission) =>
        PermissionEntity.Reconstruct<Permission, PermissionEntity>(rolePermission.permission)
      ),
    };
  }

  async create(prisma: ProjectPrismaType, entity: RoleEntity): Promise<RoleEntity> {
    entity.beforeInsertValidate();

    const record = await prisma.role.create({
      data: entity.toPersistence(),
    });
    return RoleEntity.Reconstruct<Role, RoleEntity>(record);
  }

  async update(prisma: ProjectPrismaType, id: string, entity: RoleEntity): Promise<RoleEntity> {
    const record = entity.toPersistence();
    const result = await prisma.role.update({
      where: {
        id,
      },
      data: {
        name: record.name,
        description: record.description,
      },
    });
    return RoleEntity.Reconstruct<Role, RoleEntity>(result);
  }

  async delete(prisma: ProjectPrismaType, id: string): Promise<void> {
    await prisma.role.delete({
      where: {
        id,
      },
    });
  }
}
