import { Transporter } from 'nodemailer';
import { mailer } from '../../email/mailer.js';
import { Message } from '../../email/types.js';
import { env } from '../../env.js';
import { logger } from '../../utilities/logger.js';
import { ProjectSettingsRepository } from '../repositories/projectSettings.js';

export class MailService {
  mailer: Transporter;

  constructor() {
    this.mailer = mailer();
    this.mailer.verify((e) => {
      if (e) {
        logger.error('There is an error with the email configuration you have provided.', e);
      }
    });
  }

  async sendEmail(message: Message): Promise<void> {
    const repository = new ProjectSettingsRepository();

    try {
      const projectSettings = await repository.read();
      const from = `${projectSettings[0].name} <${env.EMAIL_FROM as string}>`;

      this.mailer.sendMail({ from, ...message });
    } catch (e) {
      logger.error(`Failed to send mail to ${message.to}, subject: ${message.subject}`, e);
    }
  }
}
