import { Permission, Project, Role, User, UserProject } from '@prisma/client';
import { ProjectPrismaClient, ProjectPrismaType } from '../../database/prisma/client.js';
import { PermissionEntity } from '../permission/permission.entity.js';
import { RoleEntity } from '../role/role.entity.js';
import { UserEntity } from '../user/user.entity.js';
import { UserProjectEntity } from './userProject.entity.js';
import { ProjectEntity } from '../project/project.entity.js';

export class UserProjectRepository {
  async findMany(
    prisma: ProjectPrismaType
  ): Promise<{ userProject: UserProjectEntity; user: UserEntity; role: RoleEntity }[]> {
    const records = await prisma.userProject.findMany({
      include: {
        user: true,
        role: true,
      },
    });

    return records.map((record) => {
      return {
        userProject: UserProjectEntity.Reconstruct<UserProject, UserProjectEntity>(record),
        user: UserEntity.Reconstruct<User, UserEntity>(record.user),
        role: RoleEntity.Reconstruct<Role, RoleEntity>(record.role),
      };
    });
  }

  async findOneWithRoleByUserId(
    prisma: ProjectPrismaType,
    userId: string
  ): Promise<{
    project: ProjectEntity;
    role: RoleEntity;
    permissions: PermissionEntity[];
  } | null> {
    const record = await prisma.userProject.findFirst({
      where: {
        userId,
      },
      include: {
        project: true,
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!record) return null;

    return {
      project: ProjectEntity.Reconstruct<Project, ProjectEntity>(record.project),
      role: RoleEntity.Reconstruct<Role, RoleEntity>(record.role),
      permissions: record.role.permissions.map((permission) =>
        PermissionEntity.Reconstruct<Permission, PermissionEntity>(permission)
      ),
    };
  }

  async create(prisma: ProjectPrismaType, entity: UserProjectEntity): Promise<UserProjectEntity> {
    entity.beforeInsertValidate();

    const userProject = await prisma.userProject.create({
      data: entity.toPersistence(),
    });

    return UserProjectEntity.Reconstruct<UserProject, UserProjectEntity>(userProject);
  }

  async updateRole(
    prisma: ProjectPrismaClient,
    entity: UserProjectEntity
  ): Promise<UserProjectEntity> {
    const userProject = await prisma.userProject.update({
      where: {
        userId_projectId: {
          userId: entity.userId,
          projectId: entity.projectId,
        },
      },
      data: {
        roleId: entity.roleId,
      },
    });

    return UserProjectEntity.Reconstruct<UserProject, UserProjectEntity>(userProject);
  }

  async delete(
    prisma: ProjectPrismaType,
    projectId: string,
    userId: string
  ): Promise<UserProjectEntity> {
    const userProject = await prisma.userProject.delete({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    return UserProjectEntity.Reconstruct<UserProject, UserProjectEntity>(userProject);
  }
}
