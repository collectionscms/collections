import { PrismaClient, User } from '@prisma/client';
import crypto from 'crypto';
import { castToBoolean } from '../../admin/utilities/castToBoolean.js';
import { env } from '../../env.js';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { RecordNotUniqueException } from '../../exceptions/database/recordNotUnique.js';
import { InvalidCredentialsException } from '../../exceptions/invalidCredentials.js';
import { AuthUser } from '../config/types.js';
import { prisma } from '../database/prisma/client.js';
import { comparePasswords } from '../utilities/comparePasswords.js';
import { oneWayHash } from '../utilities/oneWayHash.js';
import { MailService } from './mail.js';
import { ProjectSettingsService } from './projectSettings.js';

export class UsersService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Exclude keys from user
  // https://www.prisma.io/docs/orm/prisma-client/queries/excluding-fields
  exclude<User, Key extends keyof User>(user: User, keys: Key[]): Omit<User, Key> {
    return Object.fromEntries(
      Object.entries(user as any).filter(([key]) => !keys.includes(key as any))
    ) as Omit<User, Key>;
  }

  async login(email: string, password: string, appAccess: boolean): Promise<AuthUser> {
    const user = await prisma.user.findFirst({
      where: {
        // todo: lowerにする
        email: email.toLowerCase(),
      },
      include: {
        role: true,
      },
    });

    if (!user || !comparePasswords(user.password, password)) {
      throw new InvalidCredentialsException('incorrect_email_or_password');
    }

    return this.toAuthUser(
      user.id,
      user.role.id,
      user.name,
      castToBoolean(user.role.adminAccess),
      appAccess
    );
  }

  async findUser(id: string): Promise<Omit<User, 'password'>> {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        role: true,
      },
    });

    return this.exclude(user, ['password']);
  }

  async findUsers(options?: { includeRole: boolean }): Promise<Omit<User, 'password'>[]> {
    const users = await this.prisma.user.findMany({
      include: {
        role: options?.includeRole,
      },
    });

    return users.map((user) => {
      return this.exclude(user, ['password']);
    });
  }

  async findMe(params: { id?: string; apiKey?: string }): Promise<{
    auth: AuthUser;
    email: string;
    apiKey: string | null;
  } | null> {
    const { id, apiKey } = params;
    if (!id && !apiKey) return null;

    const user = await prisma.user.findFirst({
      where: {
        id: id,
        apiKey: apiKey,
      },
      include: {
        role: true,
      },
    });

    if (!user) return null;

    return {
      auth: this.toAuthUser(user.id, user.role.id, user.name, castToBoolean(user.role.adminAccess)),
      email: user.email,
      apiKey: user.apiKey,
    };
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    roleId: string;
  }): Promise<User> {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        roleId: data.roleId,
      },
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
      resetPasswordExpiration?: number;
    }
  ): Promise<User> {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data,
    });

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
          gt: Date.now(),
        },
      },
    });

    if (!user) throw new InvalidCredentialsException('token_invalid_or_expired');

    await this.update(user.id, {
      password: await oneWayHash(password),
      resetPasswordExpiration: Date.now(),
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
        resetPasswordExpiration: Date.now() + 3600000, // 1 hour
      },
    });

    return token;
  }

  async sendResetPassword(email: string, token: string) {
    const projectSettings = new ProjectSettingsService(this.prisma);
    const projectSetting = await projectSettings.findProjectSetting();
    if (!projectSetting) throw new RecordNotFoundException('record_not_found');

    const projectName = projectSetting.name;
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

  private toAuthUser(
    userId: string,
    roleId: string,
    name: string,
    adminAccess: boolean,
    appAccess: boolean = false
  ): AuthUser {
    return {
      id: userId,
      roleId: roleId,
      name: name,
      adminAccess: adminAccess,
      appAccess: appAccess,
    };
  }
}
