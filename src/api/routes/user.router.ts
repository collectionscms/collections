import express, { Request, Response } from 'express';
import { env } from '../../env.js';
import { UnprocessableEntityException } from '../../exceptions/unprocessableEntity.js';
import { UserEntity } from '../data/user/user.entity.js';
import { UserRepository } from '../data/user/user.repository.js';
import { prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticatedUser } from '../middleware/auth.js';
import { MailService } from '../services/mail.service.js';
import { oneWayHash } from '../utilities/oneWayHash.js';
import { updateUserUseCaseSchema } from '../useCases/ user/updateUser.schema.js';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { UpdateUserUseCase } from '../useCases/ user/updateUser.useCase.js';

const router = express.Router();

router.get(
  '/users',
  authenticatedUser,
  asyncHandler(async (_req: Request, res: Response) => {
    const repository = new UserRepository();
    const users = await repository.findUserProfiles(prisma);

    res.json({
      users,
    });
  })
);

router.get(
  '/users/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new UserRepository();
    const user = await repository.findUserProfile(prisma, req.params.id);

    res.json({
      user,
    });
  })
);

router.post(
  '/users',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = res.user.projects[0].id;

    const repository = new UserRepository();
    await repository.checkUniqueEmail(prisma, res.user.id, req.body.email);

    const hashed = await oneWayHash(req.body.password);

    const entity = UserEntity.Construct({ ...req.body, password: hashed });
    const user = await repository.create(prisma, entity, projectId, req.body.roleId);

    res.json({
      user: user.toResponse(),
    });
  })
);

router.patch(
  '/users/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const projectId = res.user.projects[0].id;

    const validated = updateUserUseCaseSchema.safeParse({
      id,
      projectId,
      ...req.body,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const userUseCase = new UpdateUserUseCase(prisma, new UserRepository());
    await userUseCase.execute(validated.data.id, validated.data.projectId, {
      email: validated.data.email,
      password: validated.data.password,
      roleId: validated.data.roleId,
    });

    res.status(204).end();
  })
);

router.delete(
  '/users/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = res.user.id;
    const id = req.params.id;
    if (userId === id) {
      throw new UnprocessableEntityException('can_not_delete_itself');
    }

    const repository = new UserRepository();
    await repository.delete(prisma, id);

    res.status(204).end();
  })
);

router.post(
  '/users/reset-password',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const token = req.body.token;
    const password = req.body.password;

    const repository = new UserRepository();
    await repository.resetPassword(prisma, token, password);

    res.status(204).end();
  })
);

router.post(
  '/users/forgot-password',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new UserRepository();
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

export const user = router;
