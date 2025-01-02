import { ProjectPrismaType } from '../../database/prisma/client.js';
import { RoleEntity } from './role.entity.js';
import { RoleRepository } from './role.repository.js';

export class InMemoryRoleRepository extends RoleRepository {
  async create(_prisma: ProjectPrismaType, entity: RoleEntity): Promise<RoleEntity> {
    return entity;
  }
}
