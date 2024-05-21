import { getSession } from '@auth/express';
import express, { Request, Response } from 'express';
import { env } from '../../env.js';
import { InvalidCredentialsException } from '../../exceptions/invalidCredentials.js';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { authConfig } from '../configs/auth.js';
import { UserRepository } from '../data/user/user.repository.js';
import { bypassPrisma, prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { MailService } from '../services/mail.service.js';
import { getMyProfileUseCaseSchema } from '../useCases/me/getMyProfile.schema.js';
import { GetMyProfileUseCase } from '../useCases/me/getMyProfile.useCase.js';
import { getMyProjectsUseCaseSchema } from '../useCases/me/getMyProjects.schema.js';
import { GetMyProjectsUseCase } from '../useCases/me/getMyProjects.useCase.js';
import { updateProfileUseCaseSchema } from '../useCases/me/updateProfile.schema.js';
import { UpdateProfileUseCase } from '../useCases/me/updateProfile.useCase.js';
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
  authenticatedUser,
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
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new UserRepository();
    const user = await repository.findOneByEmail(prisma, req.body.email);

    if (!user) {
      throw new InvalidCredentialsException('unregistered_email_address');
    }

    user.resetPassword();
    const token = await repository.updateResetPasswordToken(prisma, user);

    const html = `You are receiving this message because you have requested a password reset for your account.<br/>
    Please click the following link and enter your new password.<br/><br/>
    <a href="${env.PUBLIC_SERVER_URL}/admin/auth/reset-password/${token}">
      ${env.PUBLIC_SERVER_URL}/admin/auth/reset-password/${token}
    </a><br/><br/>
    If you did not request this, please ignore this email and your password will remain unchanged.`;

    const mail = new MailService();
    mail.sendEmail('Collections', {
      to: req.body.email,
      subject: 'Password Reset Request',
      html,
    });

    res.json({
      message: 'success',
    });
  })
);

export const me = router;
