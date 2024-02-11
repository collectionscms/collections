import { User } from '@prisma/client';
import crypto from 'crypto';
import dayjs from 'dayjs';
import { Me, UserProfile } from '../../../configs/types.js';
import { RecordNotUniqueException } from '../../../exceptions/database/recordNotUnique.js';
import { InvalidCredentialsException } from '../../../exceptions/invalidCredentials.js';
import { PrismaType } from '../../database/prisma/client.js';
import { comparePasswords } from '../../utilities/comparePasswords.js';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { UserEntity } from './user.entity.js';

export class UserRepository {
  async findUser(prisma: PrismaType, id: string): Promise<User> {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return user;
  }

  async login(prisma: PrismaType, email: string, password: string): Promise<Me> {
    const user = await prisma.user.findFirst({
      where: {
        email: {
          contains: email,
        },
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

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      apiKey: user.apiKey,
      // todo support multiple projects
      isAdmin: user.userProjects[0].isAdmin,
      projects: user.userProjects.map((userProject) => userProject.project),
      roles: user.userProjects.map((userProject) => userProject.role),
    };
  }

  async findUserProfile(prisma: PrismaType, id: string): Promise<UserProfile> {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        userProjects: {
          select: {
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
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      role: user.userProjects[0].role,
    };
  }

  async findUserProfiles(prisma: PrismaType): Promise<UserProfile[]> {
    const users = await prisma.user.findMany({
      include: {
        userProjects: {
          select: {
            role: {
              include: {
                permissions: true,
              },
            },
          },
        },
      },
    });

    return users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        role: user.userProjects[0].role,
      };
    });
  }

  async create(
    prisma: PrismaType,
    entity: UserEntity,
    projectId: string,
    roleId: string
  ): Promise<UserEntity> {
    const user = await prisma.user.create({
      data: {
        ...entity.toPersistence(),
        userProjects: {
          create: {
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

    return UserEntity.Reconstruct(user);
  }

  async update(
    prisma: PrismaType,
    userId: string,
    entity: UserEntity,
    projectId: string,
    roleId: string
  ): Promise<UserEntity> {
    const record = entity.toPersistence();
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: record.name,
        email: record.email,
        password: record.password,
        isActive: record.isActive,
        userProjects: {
          update: {
            where: {
              userId_projectId: {
                userId,
                projectId,
              },
            },
            data: {
              role: {
                connect: {
                  id: roleId,
                },
              },
            },
          },
        },
      },
    });

    return UserEntity.Reconstruct(user);
  }

  async delete(prisma: PrismaType, id: string): Promise<void> {
    await prisma.user.delete({
      where: {
        id,
      },
    });
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

    const entity = UserEntity.Reconstruct({
      ...user,
      password: await oneWayHash(password),
      resetPasswordExpiration: new Date(),
    });

    // todo
    // await this.update(prisma, user.id, entity);

    return entity;
  }

  async setResetPasswordToken(prisma: PrismaType, email: string): Promise<string> {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new InvalidCredentialsException('unregistered_email_address');
    }

    let token: string | Buffer = crypto.randomBytes(20);
    token = token.toString('hex');

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        resetPasswordToken: token,
        resetPasswordExpiration: dayjs().add(1, 'hour').toDate(),
      },
    });

    return token;
  }
}
