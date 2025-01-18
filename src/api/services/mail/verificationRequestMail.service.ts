/* eslint-disable max-len */
import { MailService } from '../mail.service.js';

export class VerificationRequestMail extends MailService {
  async sendVerificationRequest(email: string, url: string, from: string) {
    super.sendEmail({
      to: email,
      subject: 'Sign in to Collections',
      html: this.html(url),
      text: this.text(url),
    });
  }

  html(url: string) {
    const buttonColor = '#0A85D1';
    const color = {
      background: '#f9f9f9',
      text: '#444',
      mainBackground: '#fff',
      buttonBackground: buttonColor,
      buttonBorder: buttonColor,
      buttonText: '#fff',
    };

    return `
  <body style="background: ${color.background}; padding: 20px;">
    <table width="100%" border="0" cellspacing="20" cellpadding="0"
      style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
      <tr>
        <td align="center"
          style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
          Welcome to <strong>Collections</strong>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 20px 0;">
          <table border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                  target="_blank"
                  rel="noopener noreferrer"
                  style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
                  in</a></td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center"
          style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
          If you did not request this email you can safely ignore it.<br/>
          ご希望でない場合は、このメールを無視してください。
        </td>
      </tr>
    </table>
  </body>
  `;
  }

  text(url: string) {
    return `Sign in to Collections\n${url}\n\n`;
  }
}
