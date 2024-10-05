import { Invitation } from '@prisma/client';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { BypassPrismaClient } from '../../database/prisma/client.js';
import { InvitationRepository } from '../../persistence/invitation/invitation.repository.js';
import { UserProjectEntity } from '../../persistence/userProject/userProject.entity.js';
import { UserProjectRepository } from '../../persistence/userProject/userProject.repository.js';
import { SignInWithAcceptInvitationUseCaseSchemaType } from './signInWithAcceptInvitation.useCase.schema.js';

export class SignInWithAcceptInvitationUseCase {
  constructor(
    private readonly prisma: BypassPrismaClient,
    private readonly userProjectRepository: UserProjectRepository,
    private readonly invitationRepository: InvitationRepository
  ) {}

  async execute(props: SignInWithAcceptInvitationUseCaseSchemaType): Promise<Invitation> {
    const { inviteToken, userId } = props;

    const invitation = await this.invitationRepository.findOneByToken(this.prisma, inviteToken);
    if (!invitation) {
      throw new RecordNotFoundException('record_not_found');
    }

    if (invitation.isAccepted()) {
      return invitation.toResponse();
    }

    const entity = UserProjectEntity.Construct({
      userId: userId,
      projectId: invitation.projectId,
      roleId: invitation.roleId,
    });

    const result = await this.prisma.$transaction(async (tx) => {
      await this.userProjectRepository.create(tx, entity);

      invitation.acceptInvitation();
      await this.invitationRepository.updateStatus(tx, invitation);

      return invitation;
    });

    return result.toResponse();
  }
}
