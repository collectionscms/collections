import { PrismaClient } from '@prisma/client';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { UnprocessableEntityException } from '../../exceptions/unprocessableEntity.js';

export class RolesService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findRoles() {
    return await this.prisma.role.findMany();
  }

  async findRole(id: string) {
    return await this.prisma.role.findUniqueOrThrow({
      where: {
        id: id,
      },
      include: {
        userProject: true,
      },
    });
  }

  async create(data: {
    projectId: string;
    name: string;
    description?: string;
    adminAccess: boolean;
  }) {
    return await this.prisma.role.create({
      data,
    });
  }

  async update(id: string, data: { name: string; description?: string; adminAccess: boolean }) {
    return await this.prisma.role.update({
      where: {
        id: id,
      },
      data,
    });
  }

  async delete(id: string) {
    const role = await this.findRole(id);
    if (!role) throw new RecordNotFoundException('record_not_found');
    if (role.userProject) new UnprocessableEntityException('can_not_delete_role_in_use');

    return await this.prisma.role.delete({
      where: {
        id,
      },
    });
  }
}
