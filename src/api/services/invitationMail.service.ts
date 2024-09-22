import { env } from '../../env.js';
import { InvitationEntity } from '../persistence/invitation/invitation.entity.js';
import { MailService } from './mail.service.js';

export class InvitationMailService extends MailService {
  async sendInvitation(entity: InvitationEntity): Promise<void> {
    const url = `${env.PUBLIC_SERVER_ORIGIN}/admin/invitations/accept?inviteToken=${entity.token}`;
    const html = `Invited to the project.<br/><br/>
    <a href="${url}">${url}</a><br/><br/>
    If you did not request this, please ignore this email and your password will remain unchanged.`;

    super.sendEmail('Collections', {
      to: entity.email,
      subject: 'Invited to the project',
      html,
    });
  }
}
