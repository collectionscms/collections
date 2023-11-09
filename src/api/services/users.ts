import crypto from 'crypto';
import { castToBoolean } from '../../admin/utilities/castToBoolean.js';
import { env } from '../../env.js';
import { RecordNotUniqueException } from '../../exceptions/database/recordNotUnique.js';
import { InvalidCredentialsException } from '../../exceptions/invalidCredentials.js';
import { AuthUser } from '../config/types.js';
import { PrimaryKey, User } from '../database/schemas.js';
import { comparePasswords } from '../utilities/comparePasswords.js';
import { AbstractServiceOptions, BaseService } from './base.js';
import { MailService } from './mail.js';
import { ProjectSettingsService } from './projectSettings.js';
import { RolesService } from './roles.js';

export type Me = {
  auth: AuthUser;
  user: User;
};

export class UsersService extends BaseService<User> {
  constructor(options: AbstractServiceOptions) {
    super('CollectionsUsers', options);
  }

  /**
   * @description Login a user
   * @param email
   * @param password
   * @param appAccess
   * @returns auth user
   */
  async login(email: string, password: string, appAccess: boolean): Promise<AuthUser> {
    const rolesService = new RolesService({ schema: this.schema });

    const user = await this.database
      .select('u.id', 'u.name', 'u.password', 'u.email', 'u.apiKey', {
        roleId: 'r.id',
        adminAccess: 'r.adminAccess',
      })
      .from(`${this.model} AS u`)
      .join(`${rolesService.model} AS r`, 'r.id', 'u.roleId')
      .whereRaw('LOWER(??) = ?', ['u.email', email.toLowerCase()])
      .first();

    if (!user || !comparePasswords(user.password, password)) {
      throw new InvalidCredentialsException('incorrect_email_or_password');
    }

    const role = await rolesService.readOne(user.roleId);

    return this.toAuthUser(
      user.id,
      role.id,
      user.name,
      castToBoolean(role.adminAccess),
      castToBoolean(appAccess)
    );
  }

  /**
   * @description Get a user by its primary key or api key
   * @param params
   * @returns auth user or null
   */
  async readMe(params: { primaryKey?: PrimaryKey; apiKey?: string }): Promise<Me | null> {
    const { primaryKey, apiKey } = params;
    if (!primaryKey && !apiKey) return null;

    const user = await this.readMany({
      filter: primaryKey ? { id: { _eq: primaryKey } } : { apiKey: { _eq: apiKey } },
    }).then((users) => (users.length > 0 ? users[0] : null));

    if (!user || !user.roleId) return null;

    const rolesService = new RolesService({ schema: this.schema });
    const role = await rolesService.readOne(user.roleId);

    return {
      auth: this.toAuthUser(user.id, role.id, user.name, castToBoolean(role.adminAccess)),
      user: user,
    };
  }

  /**
   * @description Get users with their role
   * @param key
   * @returns users
   */
  async readWithRole(key?: PrimaryKey): Promise<User[]> {
    const rolesService = new RolesService({ database: this.database, schema: this.schema });
    const roles = await rolesService.readMany();

    const filter = key ? { filter: { id: { _eq: key } } } : {};
    const users = await this.readMany(filter);

    return users.map((user) => {
      const role = roles.find((role) => role.id === user.roleId);
      return {
        ...user,
        roleId: role?.id,
        roleName: role?.name,
        roleDescription: role?.description,
        roleAdminAccess: role?.adminAccess,
      };
    });
  }

  /**
   * @description Check if email is unique
   * @param email
   * @param key
   * @returns
   */
  async checkUniqueEmail(email?: string, key?: PrimaryKey) {
    if (!email) return;

    const users = await this.readMany({
      filter: {
        email: { _eq: email },
      },
    });

    if (users.length > 0 && users[0].id !== key) {
      throw new RecordNotUniqueException('already_registered_email');
    }
  }

  /**
   * @description Set reset password token
   * @param email
   * @returns token
   */
  async setResetPasswordToken(email: string): Promise<string> {
    const user = await this.readMany({
      filter: { email: { _eq: email } },
    }).then((users) => users[0]);

    if (!user) {
      throw new InvalidCredentialsException('unregistered_email_address');
    }

    let token: string | Buffer = crypto.randomBytes(20);
    token = token.toString('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpiration = Date.now() + 3600000; // 1 hour

    await this.updateOne(user.id, user);

    return token;
  }

  /**
   * @description Send reset password email
   * @param email
   * @param token
   */
  async sendResetPassword(email: string, token: string) {
    const projectSettingsService = new ProjectSettingsService({ schema: this.schema });
    const projectSettings = await projectSettingsService.readMany();
    const projectName = projectSettings[0].name;
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
    userId: PrimaryKey,
    roleId: PrimaryKey,
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
