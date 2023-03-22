import nodemailer, { Transporter } from 'nodemailer';
import env from '../env';
import logger from '../utilities/logger';

let transporter: Transporter;

export default function mailer(): Transporter {
  if (transporter) return transporter;

  const transportName = env.EMAIL_TRANSPORT;

  if (transportName === 'sendgrid') {
    const sg = require('nodemailer-sendgrid');
    transporter = nodemailer.createTransport(
      sg({
        apiKey: env.EMAIL_SENDGRID_API_KEY,
      }) as any
    );
  } else {
    logger.warn('The transport name is incorrect. Check the EMAIL_TRANSPORT environment variable.');
  }

  return transporter;
}
