import { getSession } from '@auth/express';
import express, { Request, Response } from 'express';
import { env } from '../../env.js';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { authConfig } from '../configs/auth.js';
import { MeRepository } from '../data/user/me.repository.js';
import { UserRepository } from '../data/user/user.repository.js';
import { bypassPrisma, prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { MailService } from '../services/mail.service.js';
import { GetMyProjectsUseCase } from '../useCases/me/getMyProjects.useCase.js';
import { updateProfileUseCaseSchema } from '../useCases/me/updateProfile.schema.js';
import { UpdateProfileUseCase } from '../useCases/me/updateProfile.useCase.js';

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
  '/me/projects',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const id = res.user.id;

    const useCase = new GetMyProjectsUseCase(bypassPrisma, new MeRepository());
    const projects = await useCase.execute(id);

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

    const useCase = new UpdateProfileUseCase(prisma, new MeRepository(), new UserRepository());
    await useCase.execute(validated.data);

    res.status(204).end();
  })
);

router.post(
  '/me/reset-password',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const token = req.body.token;
    const password = req.body.password;

    const repository = new MeRepository();
    await repository.resetPassword(prisma, token, password);

    res.status(204).end();
  })
);

router.post(
  '/me/forgot-password',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new MeRepository();
    const token = await repository.setResetPasswordToken(prisma, req.body.email);

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
