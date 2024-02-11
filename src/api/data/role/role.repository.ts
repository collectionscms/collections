import { prismaType } from '../../database/prisma/client';
import { RoleEntity } from './role.entinty.js';

export class RoleRepository {
  async create(prisma: prismaType, entity: RoleEntity) {
    const record = await prisma.role.create({
      data: entity.toPersistence(),
    });
    return RoleEntity.Reconstruct(record);
  }
}
