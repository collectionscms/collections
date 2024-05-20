import { User } from '@auth/express';
import { Role } from '@prisma/client';
import { RecordNotUniqueException } from '../../../exceptions/database/recordNotUnique.js';
import { BypassPrismaType, PrismaType, ProjectPrismaType } from '../../database/prisma/client.js';
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
}
