import crypto from 'crypto';
import dayjs from 'dayjs';
import { InvalidCredentialsException } from '../../../exceptions/invalidCredentials.js';
import { PrismaType } from '../../database/prisma/client.js';
import { comparePasswords } from '../../utilities/comparePasswords.js';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { ProjectEntity } from '../project/project.entity.js';
import { UserEntity } from './user.entity.js';

export class MeRepository {
  async login(
    prisma: PrismaType,
    email: string,
    password: string
  ): Promise<{ user: UserEntity; projects: ProjectEntity[] }> {
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
          },
        },
      },
    });

    if (!user || !comparePasswords(user.password, password)) {
      throw new InvalidCredentialsException('incorrect_email_or_password');
    }

    return {
      user: UserEntity.Reconstruct(user),
      projects: user.userProjects.map((userProject) =>
        ProjectEntity.Reconstruct(userProject.project)
      ),
    };
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

  async findMeWithProjects(
    prisma: PrismaType,
    id: string
  ): Promise<{ user: UserEntity; projects: ProjectEntity[] }> {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        userProjects: {
          include: {
            project: true,
          },
        },
      },
    });

    return {
      user: UserEntity.Reconstruct(user),
      projects: user.userProjects.map((userProject) =>
        ProjectEntity.Reconstruct(userProject.project)
      ),
    };
  }
}
