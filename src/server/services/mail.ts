import { Transporter } from 'nodemailer';
import mailer from '../../email/mailer';
import { Message } from '../../email/types';
import env from '../../env';
import logger from '../../utilities/logger';
import ProjectSettingsRepository from '../repositories/projectSettings';

export default class MailService {
  mailer: Transporter;

  constructor() {
    this.mailer = mailer();
    this.mailer.verify((e: Error) => {
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
    } catch (err) {
      logger.error(`Failed to send mail to ${message.to}, subject: ${message.subject}`, err);
    }
  }
}
