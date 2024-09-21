import { User } from '@auth/express';
import { Permission, Project, Role } from '@prisma/client';
import { RecordNotUniqueException } from '../../../exceptions/database/recordNotUnique.js';
import { InvalidCredentialsException } from '../../../exceptions/invalidCredentials.js';
import { BypassPrismaType, ProjectPrismaType } from '../../database/prisma/client.js';
import { comparePasswords } from '../../utilities/comparePasswords.js';
import { PermissionEntity } from '../permission/permission.entity.js';
import { ProjectEntity } from '../project/project.entity.js';
import { RoleEntity } from '../role/role.entity.js';
import { UserEntity } from './user.entity.js';

export class UserRepository {
  async login(prisma: BypassPrismaType, email: string, password: string): Promise<UserEntity> {
    const user = await prisma.user.findFirst({
      where: {
        email: {
          contains: email,
        },
        isActive: true,
      },
    });

    if (!user || !user.password || !comparePasswords(user.password, password)) {
      throw new InvalidCredentialsException('incorrect_email_or_password');
    }

    return UserEntity.Reconstruct<User, UserEntity>(user);
  }

  async findOneById(prisma: BypassPrismaType, userId: string): Promise<UserEntity> {
    const record = await prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
    });

    return UserEntity.Reconstruct<User, UserEntity>(record);
  }

  async findOneByEmail(prisma: BypassPrismaType, email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    return user ? UserEntity.Reconstruct<User, UserEntity>(user) : null;
  }

  async findUserRole(
    prisma: ProjectPrismaType,
    userId: string
  ): Promise<{ user: UserEntity; role: RoleEntity }> {
    const record = await prisma.userProject.findFirstOrThrow({
      where: {
        userId,
      },
      include: {
        user: true,
        role: true,
      },
    });

    return {
      user: UserEntity.Reconstruct<User, UserEntity>(record.user),
      role: RoleEntity.Reconstruct<Role, RoleEntity>(record.role),
    };
  }

  async findUserRoles(
    prisma: ProjectPrismaType
  ): Promise<{ user: UserEntity; role: RoleEntity }[]> {
    const records = await prisma.userProject.findMany({
      include: {
        user: true,
        role: true,
      },
    });

    return records.map((record) => {
      return {
        user: UserEntity.Reconstruct<User, UserEntity>(record.user),
        role: RoleEntity.Reconstruct<Role, RoleEntity>(record.role),
      };
    });
  }

  async findOneWithProjects(
    prisma: BypassPrismaType,
    id: string
  ): Promise<{
    user: UserEntity;
    projectRoles: {
      project: ProjectEntity;
      role: RoleEntity;
      permissions: PermissionEntity[];
    }[];
  }> {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        userProjects: {
          include: {
            project: true,
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      user: UserEntity.Reconstruct<User, UserEntity>(user),
      projectRoles: user.userProjects.map((userProject) => {
        return {
          project: ProjectEntity.Reconstruct<Project, ProjectEntity>(userProject.project),
          role: RoleEntity.Reconstruct<Role, RoleEntity>(userProject.role),
          permissions: userProject.role.rolePermissions.map((rolePermission) =>
            PermissionEntity.Reconstruct<Permission, PermissionEntity>(rolePermission.permission)
          ),
        };
      }),
    };
  }

  async checkUniqueEmail(prisma: BypassPrismaType, email: string, ownId?: string) {
    const user = await prisma.user.findFirst({
      where: {
        email,
        isActive: true,
      },
    });

    if ((user && !ownId) || (user && ownId && user.id !== ownId)) {
      throw new RecordNotUniqueException('already_registered_email');
    }
  }

  async upsert(prisma: BypassPrismaType, entity: UserEntity): Promise<UserEntity> {
    const user = await prisma.user.upsert({
      update: entity.toPersistence(),
      create: entity.toPersistence(),
      where: {
        id: entity.id,
      },
    });

    return UserEntity.Reconstruct<User, UserEntity>(user);
  }

  async updateProfile(prisma: BypassPrismaType, user: UserEntity): Promise<UserEntity> {
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: user.name,
      },
    });

    return UserEntity.Reconstruct<User, UserEntity>(updatedUser);
  }
}
