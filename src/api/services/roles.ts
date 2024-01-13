import { PrismaClient } from '@prisma/client';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { UnprocessableEntityException } from '../../exceptions/unprocessableEntity.js';
import { UsersService } from './users.js';

export class RolesService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findRoles() {
    return await this.prisma.role.findMany();
  }

  async findRole(id: string) {
    return await this.prisma.role.findFirst({
      where: {
        id: id,
      },
    });
  }

  async create(data: { name: string; description?: string; adminAccess: boolean }) {
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
    const service = new UsersService(this.prisma);
    const users = await service.findUsers();
    const userWithRoles = users.filter((user) => user.roleId === id);
    if (userWithRoles.length > 0) {
      throw new UnprocessableEntityException('can_not_delete_role_in_use');
    }

    const role = await this.findRole(id);
    if (!role) throw new RecordNotFoundException('record_not_found');

    if (role.adminAccess) {
      const roles = await this.findRoles();
      const adminRoles = roles.filter((role) => role.adminAccess === true);
      if (adminRoles.length === 1) {
        throw new UnprocessableEntityException('can_not_delete_last_admin_role');
      }
    }

    return await this.prisma.role.delete({
      where: {
        id,
      },
    });
  }
}
