import { User } from '@auth/express';
import { Role } from '@prisma/client';
import { v4 } from 'uuid';
import { RecordNotUniqueException } from '../../../exceptions/database/recordNotUnique.js';
import { PrismaType, ProjectPrismaType } from '../../database/prisma/client.js';
import { RoleEntity } from '../role/role.entity.js';
import { UserEntity } from './user.entity.js';

export class UserRepository {
  async findUserById(
    prisma: ProjectPrismaType,
    projectId: string,
    userId: string
  ): Promise<UserEntity> {
    const record = await prisma.userProject.findFirstOrThrow({
      where: {
        projectId,
        userId,
      },
      include: {
        user: true,
      },
    });

    return UserEntity.Reconstruct<User, UserEntity>(record.user);
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

  async create(
    prisma: ProjectPrismaType,
    entity: UserEntity,
    projectId: string,
    roleId: string
  ): Promise<UserEntity> {
    const user = await prisma.user.create({
      data: {
        ...entity.toPersistence(),
        userProjects: {
          create: {
            id: v4(),
            role: {
              connect: {
                id: roleId,
              },
            },
            project: {
              connect: {
                id: projectId,
              },
            },
          },
        },
      },
    });

    return UserEntity.Reconstruct<User, UserEntity>(user);
  }

  async checkUniqueEmail(prisma: PrismaType, id: string, email: string) {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (user && user.id !== id) {
      throw new RecordNotUniqueException('already_registered_email');
    }
  }
}
