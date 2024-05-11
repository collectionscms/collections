import { Invitation } from '@prisma/client';
import { RecordNotUniqueException } from '../../../exceptions/database/recordNotUnique.js';
import { InvitationEntity } from '../../data/invitation/invitation.entity.js';
import { InvitationRepository } from '../../data/invitation/invitation.repository.js';
import { UserProjectRepository } from '../../data/userProject/userProject.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { InvitationMailService } from '../../services/invitationMail.service.js';
import { InviteUserUseCaseSchemaType } from './inviteUser.schema.js';

export class InviteUserUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly userProjectRepository: UserProjectRepository,
    private readonly invitationRepository: InvitationRepository,
    private readonly invitationMailService: InvitationMailService
  ) {}

  async execute(props: InviteUserUseCaseSchemaType): Promise<Invitation> {
    const { projectId, email, invitedById, roleId } = props;

    // Check if the user is already in the project
    const userProjects = await this.userProjectRepository.findMany(this.prisma);
    const hasUserInProject = userProjects.some((userProject) => userProject.user.email === email);

    if (hasUserInProject) {
      throw new RecordNotUniqueException('already_invited_email');
    }

    // Check if the user is already invited
    const invitations = await this.invitationRepository.findManyByPendingStatus(this.prisma);
    const hasInvitation = invitations.some((invitation) => invitation.email === email);

    if (hasInvitation) {
      throw new RecordNotUniqueException('already_invited_email');
    }

    const entity = InvitationEntity.Construct({
      email,
      projectId,
      roleId,
      invitedById,
    });

    await this.invitationMailService.sendInvitation(entity);
    const result = await this.invitationRepository.create(this.prisma, entity);

    return result.toResponse();
  }
}
