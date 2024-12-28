import { ProjectPrismaType } from '../../database/prisma/client.js';
import { buildPermissionEntity } from '../permission/permission.entity.fixture.js';
import { PermissionEntity } from '../permission/permission.entity.js';
import { buildProjectEntity } from '../project/project.entity.fixture.js';
import { ProjectEntity } from '../project/project.entity.js';
import { buildRoleEntity } from '../role/role.entity.fixture.js';
import { RoleEntity } from '../role/role.entity.js';
import { buildUserEntity } from '../user/user.entity.fixture.js';
import { UserEntity } from '../user/user.entity.js';
import { UserProjectRepository } from './userProject.repository.js';

export class InMemoryUserProjectRepository extends UserProjectRepository {
  async findOneWithRoleByUserId(
    _prisma: ProjectPrismaType,
    userId: string
  ): Promise<{
    project: ProjectEntity;
    user: UserEntity;
    role: RoleEntity;
    permissions: PermissionEntity[];
  } | null> {
    return Promise.resolve({
      project: buildProjectEntity(),
      user: buildUserEntity({
        id: userId,
      }),
      role: buildRoleEntity(),
      permissions: [buildPermissionEntity()],
    });
  }
}
