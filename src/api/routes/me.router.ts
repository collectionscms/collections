import { getSession } from '@auth/express';
import express, { Request, Response } from 'express';
import { authConfig } from '../configs/auth.js';
import { UserRepository } from '../data/user/user.repository.js';
import { prisma, projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticatedUser } from '../middleware/auth.js';
import { oneWayHash } from '../utilities/oneWayHash.js';
import { env } from '../../env.js';
import { MeRepository } from '../data/user/me.repository.js';
import { MailService } from '../services/mail.service.js';

const router = express.Router();

router.get(
  '/me',
  asyncHandler(async (req: Request, res: Response) => {
    const user = res.user ?? (await getSession(req, authConfig));

    return res.json({
      me: user || null,
    });
  })
);

router.patch(
  '/me',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const id = res.user.id;
    const projectId = res.user.projects[0].id;

    const repository = new UserRepository();
    await repository.checkUniqueEmail(prisma, id, req.body.email);

    const user = await repository.findUserById(projectPrisma(projectId), id);
    const password = req.body.password ? await oneWayHash(req.body.password) : user.password();

    await repository.update(projectPrisma(projectId), id, {
      name: req.body.name,
      email: req.body.email,
      password,
    });

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
