import express, { Request, Response } from 'express';
import { InvalidCredentialsException } from '../../exceptions/invalidCredentials.js';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { UnknownException } from '../../exceptions/storage/unknown.js';
import { bypassPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { InvitationRepository } from '../persistence/invitation/invitation.repository.js';
import { UserProjectRepository } from '../persistence/userProject/userProject.repository.js';
import { signInErrorUseCaseSchema } from '../useCases/auth/signInError.useCase.schema.js';
import { SignInWithAcceptInvitationUseCase } from '../useCases/auth/signInWithAcceptInvitation.useCase.js';
import { signInWithAcceptInvitationUseCaseSchema } from '../useCases/auth/signInWithAcceptInvitation.useCase.schema.js';

const router = express.Router();

// Called back after Auth.js and OAuth provider integration.
router.get(
  '/auth/providers/:provider',
  asyncHandler(async (req: Request, res: Response) => {
    const validated = signInWithAcceptInvitationUseCaseSchema.safeParse({
      inviteToken: req.query?.inviteToken,
      userId: res.user.id,
    });

    if (validated.success) {
      const useCase = new SignInWithAcceptInvitationUseCase(
        bypassPrisma,
        new UserProjectRepository(),
        new InvitationRepository()
      );
      await useCase.execute(validated.data);
    }

    return res.redirect('/admin');
  })
);

// Called when an exception is thrown by Auth.js authentication.
router.get(
  '/auth/signin',
  asyncHandler(async (req: Request, res: Response) => {
    const validated = signInErrorUseCaseSchema.safeParse({
      error: req.query.error,
      code: req.query.code,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    if (
      validated.data.error === 'CredentialsSignin' &&
      validated.data.code === 'invalid_credentials'
    ) {
      throw new InvalidCredentialsException('incorrect_email_or_password');
    } else {
      throw new UnknownException('internal_server_error');
    }
  })
);

export const auth = router;
