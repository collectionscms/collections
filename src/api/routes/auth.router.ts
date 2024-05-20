import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { InvitationRepository } from '../data/invitation/invitation.repository.js';
import { UserRepository } from '../data/user/user.repository.js';
import { UserProjectRepository } from '../data/userProject/userProject.repository.js';
import { bypassPrisma, prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { SignUpMailService } from '../services/signUpMail.service.js';
import { signUpUseCaseSchema } from '../useCases/auth/signUp.schema.js';
import { SignUpUseCase } from '../useCases/auth/signUp.useCase.js';

const router = express.Router();

router.post(
  '/signUp',
  asyncHandler(async (req: Request, res: Response) => {
    const validated = signUpUseCaseSchema.safeParse({
      email: req.body.email,
      password: req.body.password,
      token: req.body.token,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new SignUpUseCase(
      prisma,
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

export const auth = router;
