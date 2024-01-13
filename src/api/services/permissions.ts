import { PrismaClient } from '@prisma/client';

export class PermissionsService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findRolePermissions(roleId: string) {
    return await this.prisma.rolePermission.findMany({
      where: {
        roleId,
      },
      include: {
        permission: true,
      },
    });
  }
}
