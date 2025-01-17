import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { bypassPrisma, projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { InvitationRepository } from '../persistence/invitation/invitation.repository.js';
import { ProjectRepository } from '../persistence/project/project.repository.js';
import { UserProjectRepository } from '../persistence/userProject/userProject.repository.js';
import { InvitationMailService } from '../services/mail/invitationMail.service.js';
import { AcceptInvitationUseCase } from '../useCases/invitation/acceptInvitation.useCase.js';
import { acceptInvitationUseCaseSchema } from '../useCases/invitation/acceptInvitation.useCase.schema.js';
import { InviteUserUseCase } from '../useCases/invitation/inviteUser.useCase.js';
import { inviteUserUseCaseSchema } from '../useCases/invitation/inviteUser.useCase.schema.js';

const router = express.Router();

router.post(
  '/invitations',
  authenticatedUser,
  validateAccess(['inviteUser']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = inviteUserUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      email: req.body.email,
      roleId: req.body.roleId,
      invitedById: res.user.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new InviteUserUseCase(
      projectPrisma(validated.data.projectId),
      new UserProjectRepository(),
      new InvitationRepository(),
      new ProjectRepository(),
      new InvitationMailService()
    );

    const invitation = await useCase.execute(validated.data);

    res.json({
      invitation,
    });
  })
);

router.post(
  '/invitations/accept',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const validated = acceptInvitationUseCaseSchema.safeParse({
      inviteToken: req.body.inviteToken,
      userId: res.user.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new AcceptInvitationUseCase(
      bypassPrisma,
      new UserProjectRepository(),
      new InvitationRepository()
    );

    const result = await useCase.execute(validated.data);

    res.json({
      project: result.project,
    });
  })
);

export const invitation = router;
