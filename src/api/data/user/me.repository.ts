import { Project } from '@prisma/client';
import crypto from 'crypto';
import dayjs from 'dayjs';
import { InvalidCredentialsException } from '../../../exceptions/invalidCredentials.js';
import { Me } from '../../../types/index.js';
import { PrismaType, projectPrisma } from '../../database/prisma/client.js';
import { comparePasswords } from '../../utilities/comparePasswords.js';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { UserEntity } from './user.entity.js';

export class MeRepository {
  async login(prisma: PrismaType, email: string, password: string): Promise<Me> {
    const user = await prisma.user.findFirst({
      where: {
        email: {
          contains: email,
        },
      },
      include: {
        userProjects: true,
      },
    });

    if (!user || !comparePasswords(user.password, password)) {
      throw new InvalidCredentialsException('incorrect_email_or_password');
    }

    let projects: Project[] = [];
    for (const userProject of user.userProjects) {
      const project = await projectPrisma(userProject.projectId).project.findUnique({
        where: {
          id: userProject.projectId,
        },
      });
      if (project) {
        projects.push(project);
      }
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      apiKey: user.apiKey,
      isAdmin: true,
      // todo
      roles: [],
      projects: projects,
      // isAdmin: user.userProjects[0].isAdmin,
      // roles: user.userProjects.map((userProject) => userProject.role),
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
}
