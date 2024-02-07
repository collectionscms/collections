import { PrismaClient, User } from '@prisma/client';
import crypto from 'crypto';
import dayjs from 'dayjs';
import { Me, UserProfile } from '../../configs/types.js';
import { env } from '../../env.js';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { RecordNotUniqueException } from '../../exceptions/database/recordNotUnique.js';
import { InvalidCredentialsException } from '../../exceptions/invalidCredentials.js';
import { prisma } from '../database/prisma/client.js';
import { comparePasswords } from '../utilities/comparePasswords.js';
import { oneWayHash } from '../utilities/oneWayHash.js';
import { MailService } from './mail.js';
import { ProjectService } from './project.js';

export class UserService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async login(email: string, password: string): Promise<Me> {
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

  async findUser(id: string): Promise<UserProfile> {
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

  async findUsers(): Promise<UserProfile[]> {
    const users = await this.prisma.user.findMany({
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

  async create(data: {
    projectId: string;
    name: string;
    email: string;
    password: string;
    roleId: string;
  }): Promise<User> {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }

  async update(
    id: string,
    data: {
      name?: string;
      email?: string;
      password?: string;
      roleId?: string;
      resetPasswordExpiration?: Date;
    }
  ): Promise<User> {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data,
    });

    // todo update role

    return user;
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async resetPassword(token: string, password: string): Promise<User> {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiration: {
          gt: new Date(),
        },
      },
    });

    if (!user) throw new InvalidCredentialsException('token_invalid_or_expired');

    await this.update(user.id, {
      password: await oneWayHash(password),
      resetPasswordExpiration: new Date(),
    });

    return user;
  }

  async checkUniqueEmail(email?: string, id?: string) {
    if (!email) return;

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (user && user.id !== id) {
      throw new RecordNotUniqueException('already_registered_email');
    }
  }

  async setResetPasswordToken(email: string): Promise<string> {
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

  async sendResetPassword(email: string, token: string) {
    const service = new ProjectService(this.prisma);
    const project = await service.findProject();
    if (!project) throw new RecordNotFoundException('record_not_found');

    const projectName = project.name;
    const html = `You are receiving this message because you have requested a password reset for your account.<br/>
      Please click the following link and enter your new password.<br/><br/>
      <a href="${env.PUBLIC_SERVER_URL}/admin/auth/reset-password/${token}">
        ${env.PUBLIC_SERVER_URL}/admin/auth/reset-password/${token}
      </a><br/><br/>
      If you did not request this, please ignore this email and your password will remain unchanged.`;

    const mail = new MailService();
    mail.sendEmail(projectName, {
      to: email,
      subject: 'Password Reset Request',
      html,
    });
  }
}
