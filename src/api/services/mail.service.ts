import { Transporter } from 'nodemailer';
import { mailer } from '../../email/mailer.js';
import { Message } from '../../email/types.js';
import { env } from '../../env.js';
import { logger } from '../../utilities/logger.js';

export class MailService {
  mailer: Transporter;

  origin = `${env.PROTOCOL}://${env.PUBLIC_PORTAL_SUBDOMAIN}.${env.SERVER_HOST}${
    env.SERVER_PORT ? `:${env.SERVER_PORT}` : ''
  }`;

  constructor() {
    this.mailer = mailer();
    this.mailer.verify((e) => {
      if (e) {
        logger.error('There is an error with the email configuration you have provided.', e);
      }
    });
  }

  async sendEmail(projectName: string, message: Message): Promise<void> {
    try {
      const from = `${projectName} <${env.EMAIL_FROM as string}>`;
      this.mailer.sendMail({ from, ...message });
    } catch (e) {
      logger.error(`Failed to send mail to ${message.to}, subject: ${message.subject}`, e);
    }
  }
}
