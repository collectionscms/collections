import { User } from '@auth/express';
import { Permission, Project, Role } from '@prisma/client';
import { RecordNotUniqueException } from '../../../exceptions/database/recordNotUnique.js';
import { InvalidCredentialsException } from '../../../exceptions/invalidCredentials.js';
import { BypassPrismaType, PrismaType, ProjectPrismaType } from '../../database/prisma/client.js';
import { comparePasswords } from '../../utilities/comparePasswords.js';
import { oneWayHash } from '../../utilities/oneWayHash.js';
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
      include: {
        userProjects: {
          include: {
            project: true,
            role: {
              include: {
                permissions: true,
              },
            },
          },
        },
      },
    });

    if (!user || !comparePasswords(user.password, password)) {
      throw new InvalidCredentialsException('incorrect_email_or_password');
    }

    return UserEntity.Reconstruct<User, UserEntity>(user);
  }

  async findOneById(prisma: PrismaType, userId: string): Promise<UserEntity> {
    const record = await prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
    });

    return UserEntity.Reconstruct<User, UserEntity>(record);
  }

  async findOneByEmail(prisma: PrismaType, email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    return user ? UserEntity.Reconstruct<User, UserEntity>(user) : null;
  }

  async findOneByConfirmationToken(prisma: PrismaType, token: string): Promise<UserEntity | null> {
    const user = await prisma.user.findFirst({
      where: {
        confirmationToken: token,
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
                permissions: true,
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
          permissions: userProject.role.permissions.map((permission) =>
            PermissionEntity.Reconstruct<Permission, PermissionEntity>(permission)
          ),
        };
      }),
    };
  }

  async checkUniqueEmail(prisma: PrismaType, email: string, ownId?: string) {
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

  async verified(prisma: PrismaType, entity: UserEntity): Promise<UserEntity> {
    const user = await prisma.user.update({
      where: {
        id: entity.id,
      },
      data: {
        confirmedAt: entity.confirmedAt,
        isActive: entity.isActive,
      },
    });

    return UserEntity.Reconstruct<User, UserEntity>(user);
  }

  async resetPassword(prisma: PrismaType, token: string, password: string): Promise<UserEntity> {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiration: {
          gt: new Date(),
        },
      },
    });

    if (!user) throw new InvalidCredentialsException('token_invalid_or_expired');

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: await oneWayHash(password),
        resetPasswordExpiration: new Date(),
      },
    });

    return UserEntity.Reconstruct<User, UserEntity>(updatedUser);
  }

  async updatePasswordToken(prisma: PrismaType, entity: UserEntity): Promise<UserEntity> {
    const user = await prisma.user.update({
      where: {
        id: entity.id,
      },
      data: {
        resetPasswordToken: entity.resetPasswordToken,
        resetPasswordExpiration: entity.resetPasswordExpiration,
      },
    });

    return UserEntity.Reconstruct<User, UserEntity>(user);
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

  async updateProfile(prisma: PrismaType, user: UserEntity): Promise<UserEntity> {
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    return UserEntity.Reconstruct<User, UserEntity>(updatedUser);
  }
}
