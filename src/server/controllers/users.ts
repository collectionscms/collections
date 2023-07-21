import crypto from 'crypto';
import express, { Request, Response } from 'express';
import { env } from '../../env.js';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { InvalidCredentialsException } from '../../exceptions/invalidCredentials.js';
import { UnprocessableEntityException } from '../../exceptions/unprocessableEntity.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { permissionsHandler } from '../middleware/permissionsHandler.js';
import { UsersRepository } from '../repositories/users.js';
import { MailService } from '../services/mail.js';
import { oneWayHash } from '../utilities/oneWayHash.js';

const router = express.Router();

router.get(
  '/users',
  permissionsHandler([{ collection: 'superfast_users', action: 'read' }]),
  asyncHandler(async (_req: Request, res: Response) => {
    const repository = new UsersRepository();

    const users = await repository.readWithRole();

    res.json({
      users: users.flatMap(({ ...user }) => payload(user)),
    });
  })
);

router.get(
  '/users/:id',
  permissionsHandler([{ collection: 'superfast_users', action: 'read' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const repository = new UsersRepository();

    const user = await repository.readOneWithRole(id);
    if (!user) throw new RecordNotFoundException('record_not_found');

    res.json({
      user: payload(user),
    });
  })
);

router.post(
  '/users',
  permissionsHandler([{ collection: 'superfast_users', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new UsersRepository();

    req.body.password = await oneWayHash(req.body.password);
    const userId = await repository.create(req.body);

    res.json({
      id: userId,
    });
  })
);

router.patch(
  '/users/:id',
  permissionsHandler([{ collection: 'superfast_users', action: 'update' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const usersRepository = new UsersRepository();

    if (req.body.password) {
      req.body.password = await oneWayHash(req.body.password);
    }

    await usersRepository.update(id, req.body);

    res.status(204).end();
  })
);

router.delete(
  '/users/:id',
  permissionsHandler([{ collection: 'superfast_users', action: 'delete' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const usersRepository = new UsersRepository();

    if (req.userId === id) {
      throw new UnprocessableEntityException('can_not_delete_itself');
    }

    await usersRepository.delete(id);

    res.status(204).end();
  })
);

router.post(
  '/users/reset-password',
  asyncHandler(async (req: Request, res: Response) => {
    const token = req.body.token;
    const password = req.body.password;

    const repository = new UsersRepository();
    const user = await repository.readResetPasswordToken(token);

    if (!user) {
      throw new InvalidCredentialsException('token_invalid_or_expired');
    }

    await repository.update(user.id, {
      password: await oneWayHash(password),
      reset_password_expiration: Date.now(),
    });

    res.json({
      message: 'success',
    });
  })
);

router.post(
  '/users/forgot-password',
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new UsersRepository();
    const users = await repository.read({ email: req.body.email });
    const user = users[0];

    if (!user) {
      throw new InvalidCredentialsException('unregistered_email_address');
    }

    let token: string | Buffer = crypto.randomBytes(20);
    token = token.toString('hex');

    user.reset_password_token = token;
    user.reset_password_expiration = Date.now() + 3600000; // 1 hour

    await repository.update(user.id, user);

    const mail = new MailService();
    mail.sendEmail({
      to: user.email,
      subject: 'Reset Password',
      html: `${env.PUBLIC_SERVER_URL}/admin/auth/reset-password/${user.reset_password_token}`,
    });

    res.json({
      message: 'success',
    });
  })
);

const payload = (user: any) => {
  return {
    id: user.id,
    user_name: user.user_name,
    email: user.email,
    is_active: user.is_active,
    api_key: user.api_key ? '********' : null,
    updated_at: user.updated_at,
    role: {
      id: user.role_id,
      name: user.role_name,
      description: user.role_description,
      admin_access: user.role_admin_access,
    },
  };
};

export const users = router;
