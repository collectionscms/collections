import crypto from 'crypto';
import express, { Request, Response } from 'express';
import env from '../../env';
import { InvalidCredentialsException } from '../../shared/exceptions/invalidCredentials';
import { UnprocessableEntityException } from '../../shared/exceptions/unprocessableEntity';
import asyncHandler from '../middleware/asyncHandler';
import permissionsHandler from '../middleware/permissionsHandler';
import UsersRepository from '../repositories/users';
import MailService from '../services/mail';
import { oneWayHash } from '../utilities/oneWayHash';

const app = express();

app.get(
  '/users',
  permissionsHandler([{ collection: 'superfast_users', action: 'read' }]),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.userId) {
      throw new InvalidCredentialsException('invalid_user_credentials');
    }

    const repository = new UsersRepository();

    const users = await repository.readWithRole();

    res.json({
      users: users.flatMap(({ ...user }) => payload(user)),
    });
  })
);

app.get(
  '/users/:id',
  permissionsHandler([{ collection: 'superfast_users', action: 'read' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const repository = new UsersRepository();

    const user = await repository.readOneWithRole({ id });

    if (user) {
      res.json({
        user: payload(user),
      });
    } else {
      res.status(400).end();
    }
  })
);

app.post(
  '/users',
  permissionsHandler([{ collection: 'superfast_users', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const repository = new UsersRepository();

    req.body.password = await oneWayHash(req.body.password);
    const user = await repository.create(req.body);

    res.json({
      user,
    });
  })
);

app.patch(
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

app.delete(
  '/users/:id',
  permissionsHandler([{ collection: 'superfast_users', action: 'delete' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const usersRepository = new UsersRepository();

    if (!req.userId) {
      throw new InvalidCredentialsException('invalid_user_credentials');
    }

    if (req.userId === id) {
      throw new UnprocessableEntityException('can_not_delete_itself');
    }

    await usersRepository.delete(id);

    res.status(204).end();
  })
);

app.post(
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
      resetPasswordExpiration: Date.now(),
    });

    res.json({
      message: 'success',
    });
  })
);

app.post(
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

    user.resetPasswordToken = token;
    user.resetPasswordExpiration = Date.now() + 3600000; // 1 hour

    await repository.update(user.id, user);

    const mail = new MailService();
    mail.sendEmail({
      to: user.email,
      subject: 'Reset Password',
      html: `${env.SERVER_URL}/admin/auth/reset-password/${user.resetPasswordToken}`,
    });

    res.json({
      message: 'success',
    });
  })
);

const payload = (user: any) => {
  return {
    id: user.id,
    lastName: user.lastName,
    firstName: user.firstName,
    userName: user.userName,
    email: user.email,
    isActive: user.isActive,
    apiKey: user.apiKey,
    updatedAt: user.updatedAt,
    role: {
      id: user.roleId,
      name: user.roleName,
      description: user.roleDescription,
      adminAccess: user.roleAdminAccess,
    },
  };
};

export default app;
