import { PrismaClient } from '@prisma/client';

export class PermissionService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findRolePermissions(roleId: string) {
    return await this.prisma.permission.findMany({
      where: {
        roleId,
      },
    });
  }
}
