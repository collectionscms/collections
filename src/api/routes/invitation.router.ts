import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { InvitationRepository } from '../data/invitation/invitation.repository.js';
import { UserProjectRepository } from '../data/userProject/userProject.repository.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { InvitationMailService } from '../services/invitationMail.service.js';
import { MailService } from '../services/mail.service.js';
import { inviteUserUseCaseSchema } from '../useCases/user/inviteUser.schema.js';
import { InviteUserUseCase } from '../useCases/user/inviteUser.useCase.js';

const router = express.Router();

router.post(
  '/invitations',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const validated = inviteUserUseCaseSchema.safeParse({
      projectId: res.tenantProjectId,
      email: req.body.email,
      roleId: req.body.roleId,
      invitedById: res.user.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new InviteUserUseCase(
      projectPrisma(validated.data.projectId),
      new UserProjectRepository(),
      new InvitationRepository(),
      new InvitationMailService(new MailService())
    );

    const invitation = await useCase.execute(validated.data);

    res.json({
      invitation,
    });
  })
);

export const invitation = router;
