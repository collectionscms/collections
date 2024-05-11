import { env } from '../../env.js';
import { InvitationEntity } from '../data/invitation/invitation.entity.js';
import { MailService } from './mail.service.js';

export class InvitationMailService {
  constructor(private readonly mailService: MailService) {}

  async sendInvitation(entity: InvitationEntity): Promise<void> {
    const html = `Invited to the project.<br/><br/>
    <a href="${env.PUBLIC_SERVER_URL}/admin/invitations?token=${entity.token}&projectId=${entity.projectId}">
      ${env.PUBLIC_SERVER_URL}/admin/invitations?token=${entity.token}&projectId=${entity.projectId}
    </a><br/><br/>
    If you did not request this, please ignore this email and your password will remain unchanged.`;

    this.mailService.sendEmail('Collections', {
      to: entity.email,
      subject: 'Invited to the project',
      html,
    });
  }
}
