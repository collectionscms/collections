import express, { Request, Response } from 'express';
import { InvalidCredentialsException } from '../../exceptions/invalidCredentials.js';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { UnknownException } from '../../exceptions/storage/unknown.js';
import { InvitationRepository } from '../persistence/invitation/invitation.repository.js';
import { UserRepository } from '../persistence/user/user.repository.js';
import { UserProjectRepository } from '../persistence/userProject/userProject.repository.js';
import { bypassPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { SignUpMailService } from '../services/signUpMail.service.js';
import { signInErrorUseCaseSchema } from '../useCases/auth/signInError.useCase.schema.js';
import { signUpUseCaseSchema } from '../useCases/auth/signUp.useCase.schema.js';
import { SignUpUseCase } from '../useCases/auth/signUp.useCase.js';
import { verifyUseCaseSchema } from '../useCases/auth/verify.useCase.schema.js';
import { VerifyUseCase } from '../useCases/auth/verify.useCase.js';

const router = express.Router();

router.post(
  '/sign-up',
  asyncHandler(async (req: Request, res: Response) => {
    const validated = signUpUseCaseSchema.safeParse({
      email: req.body.email,
      password: req.body.password,
      token: req.body.token,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new SignUpUseCase(
      bypassPrisma,
      new UserRepository(),
      new InvitationRepository(),
      new UserProjectRepository(),
      new SignUpMailService()
    );
    const me = await useCase.execute(validated.data);

    return res.json({
      me,
    });
  })
);

router.post(
  '/verify',
  asyncHandler(async (req: Request, res: Response) => {
    const validated = verifyUseCaseSchema.safeParse({
      token: req.body.token,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new VerifyUseCase(bypassPrisma, new UserRepository());
    const me = await useCase.execute(validated.data);

    return res.json({
      me,
    });
  })
);

// Called when an exception is thrown by auth.js authorize
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
