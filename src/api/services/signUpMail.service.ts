import { env } from '../../env.js';
import { UserEntity } from '../persistences/user/user.entity.js';
import { MailService } from './mail.service.js';

export class SignUpMailService extends MailService {
  async sendVerify(entity: UserEntity): Promise<void> {
    const url = `${env.PUBLIC_SERVER_ORIGIN}/admin/auth/verify?token=${entity.confirmationToken}`;
    const html = `Hi! Thank you for creating a Collection account.
    Please validate your email address. Once verified, you will be able to log in successfully.<br/><br/>
    <a href="${url}">${url}</a><br/><br/>`;

    super.sendEmail('Collections', {
      to: entity.email,
      subject: 'Complete your account',
      html,
    });
  }
}
