import { getSession } from '@auth/express';
import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { authConfig } from '../configs/auth.js';
import { UserRepository } from '../data/user/user.repository.js';
import { bypassPrisma, prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { ResetPasswordMailService } from '../services/resetPasswordMail.service.js';
import { getMyProfileUseCaseSchema } from '../useCases/me/getMyProfile.schema.js';
import { GetMyProfileUseCase } from '../useCases/me/getMyProfile.useCase.js';
import { getMyProjectsUseCaseSchema } from '../useCases/me/getMyProjects.schema.js';
import { GetMyProjectsUseCase } from '../useCases/me/getMyProjects.useCase.js';
import { updateProfileUseCaseSchema } from '../useCases/me/updateProfile.schema.js';
import { UpdateProfileUseCase } from '../useCases/me/updateProfile.useCase.js';
import { forgotPasswordUseCaseSchema } from '../useCases/user/forgotPassword.schema.js';
import { ForgotPasswordUseCase } from '../useCases/user/forgotPassword.useCase.js';
import { resetPasswordUseCaseSchema } from '../useCases/user/resetPassword.schema.js';
import { ResetPasswordUseCase } from '../useCases/user/resetPassword.useCase.js';

const router = express.Router();

router.get(
  '/me',
  asyncHandler(async (req: Request, res: Response) => {
    const user = res.user ?? (await getSession(req, authConfig))?.user;

    return res.json({
      me: user || null,
    });
  })
);

router.get(
  '/me/profile',
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getMyProfileUseCaseSchema.safeParse({
      userId: res.user.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetMyProfileUseCase(prisma, new UserRepository());
    const user = await useCase.execute(validated.data.userId);

    return res.json({ user });
  })
);

router.get(
  '/me/projects',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getMyProjectsUseCaseSchema.safeParse({
      userId: res.user.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetMyProjectsUseCase(bypassPrisma, new UserRepository());
    const projects = await useCase.execute(validated.data.userId);

    return res.json(projects);
  })
);

router.patch(
  '/me',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const validated = updateProfileUseCaseSchema.safeParse({
      userId: res.user.id,
      ...req.body,
      password: req.body.password || null,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new UpdateProfileUseCase(prisma, new UserRepository());
    await useCase.execute(validated.data);

    res.status(204).end();
  })
);

router.post(
  '/me/reset-password',
  asyncHandler(async (req: Request, res: Response) => {
    const validated = resetPasswordUseCaseSchema.safeParse({
      token: req.body.token,
      password: req.body.password,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new ResetPasswordUseCase(prisma, new UserRepository());
    await useCase.execute(validated.data);

    res.status(204).end();
  })
);

router.post(
  '/me/forgot-password',
  asyncHandler(async (req: Request, res: Response) => {
    const validated = forgotPasswordUseCaseSchema.safeParse({
      email: req.body.email,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new ForgotPasswordUseCase(
      prisma,
      new UserRepository(),
      new ResetPasswordMailService()
    );
    await useCase.execute(validated.data);

    res.status(204).end();
  })
);

export const me = router;
