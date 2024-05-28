import { env } from '../../env.js';
import { MailService } from './mail.service.js';

export class ResetPasswordMailService extends MailService {
  async sendResetPassword(token: string, email: string): Promise<void> {
    const html = `You are receiving this message because you have requested a password reset for your account.<br/>
    Please click the following link and enter your new password.<br/><br/>
    <a href="${env.PUBLIC_SERVER_ORIGIN}/admin/auth/reset-password/${token}">
      ${env.PUBLIC_SERVER_ORIGIN}/admin/auth/reset-password/${token}
    </a><br/><br/>
    If you did not request this, please ignore this email and your password will remain unchanged.`;

    const mail = new MailService();
    super.sendEmail('Collections', {
      to: email,
      subject: 'Password Reset Request',
      html,
    });
  }
}
