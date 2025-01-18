import { env } from '../../../env.js';
import i18n from '../../../lang/translations/config.js';
import { InvitationEntity } from '../../persistence/invitation/invitation.entity.js';
import { MailService } from '../mail.service.js';

export class InvitationMailService extends MailService {
  async sendInvitation(
    sourceLanguage: string,
    projectName: string,
    entity: InvitationEntity
  ): Promise<void> {
    const t = await i18n.changeLanguage(sourceLanguage);

    const url = `${env.PUBLIC_SERVER_ORIGIN}/admin/invitations/accept?inviteToken=${entity.token}`;
    const html = t('emails.invitation.body', { projectName, url });

    super.sendEmail({
      to: entity.email,
      subject: t('emails.invitation.subject', { projectName }),
      html,
    });
  }
}
