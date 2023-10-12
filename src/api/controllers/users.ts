import crypto from 'crypto';
import express, { Request, Response } from 'express';
import { env } from '../../env.js';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { InvalidCredentialsException } from '../../exceptions/invalidCredentials.js';
import { UnprocessableEntityException } from '../../exceptions/unprocessableEntity.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { permissionsHandler } from '../middleware/permissionsHandler.js';
import { MailService } from '../services/mail.js';
import { ProjectSettingsService } from '../services/projectSettings.js';
import { UsersService } from '../services/users.js';
import { oneWayHash } from '../utilities/oneWayHash.js';

const router = express.Router();

router.get(
  '/users',
  permissionsHandler([{ model: 'CollectionsUsers', action: 'read' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const service = new UsersService({ schema: req.schema });
    const users = await service.readWithRole();

    res.json({
      users: users.flatMap(({ ...user }) => payload(user)),
    });
  })
);

router.get(
  '/users/:id',
  permissionsHandler([{ model: 'CollectionsUsers', action: 'read' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const service = new UsersService({ schema: req.schema });
    const user = await service.readWithRole(id).then((users) => users[0]);

    if (!user) throw new RecordNotFoundException('record_not_found');

    res.json({
      user: payload(user),
    });
  })
);

router.post(
  '/users',
  permissionsHandler([{ model: 'CollectionsUsers', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const service = new UsersService({ schema: req.schema });
    await service.checkUniqueEmail(req.body.email);

    const hashed = await oneWayHash(req.body.password);
    const userId = await service.createOne({
      ...req.body,
      password: hashed,
    });

    res.json({
      id: userId,
    });
  })
);

router.patch(
  '/users/:id',
  permissionsHandler([{ model: 'CollectionsUsers', action: 'update' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const service = new UsersService({ schema: req.schema });
    await service.checkUniqueEmail(req.body.email, id);

    const data = req.body.password
      ? { ...req.body, password: await oneWayHash(req.body.password) }
      : req.body;

    await service.updateOne(id, data);

    res.status(204).end();
  })
);

router.delete(
  '/users/:id',
  permissionsHandler([{ model: 'CollectionsUsers', action: 'delete' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (req.userId === id) {
      throw new UnprocessableEntityException('can_not_delete_itself');
    }

    const service = new UsersService({ schema: req.schema });
    await service.deleteOne(id);

    res.status(204).end();
  })
);

router.post(
  '/users/reset-password',
  asyncHandler(async (req: Request, res: Response) => {
    const token = req.body.token;
    const password = req.body.password;

    const service = new UsersService({ schema: req.schema });
    const users = await service.readMany({
      filter: {
        _and: [{ resetPasswordToken: { _eq: token } }, { resetPasswordToken: { _gt: Date.now() } }],
      },
    });

    if (users.length === 0) {
      throw new InvalidCredentialsException('token_invalid_or_expired');
    }

    await service.updateOne(users[0].id, {
      password: await oneWayHash(password),
      resetPasswordExpiration: Date.now(),
    });

    res.json({
      message: 'success',
    });
  })
);

router.post(
  '/users/forgot-password',
  asyncHandler(async (req: Request, res: Response) => {
    const service = new UsersService({ schema: req.schema });
    const user = await service
      .readMany({
        filter: { email: { _eq: req.body.email } },
      })
      .then((users) => users[0]);

    if (!user) {
      throw new InvalidCredentialsException('unregistered_email_address');
    }

    let token: string | Buffer = crypto.randomBytes(20);
    token = token.toString('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpiration = Date.now() + 3600000; // 1 hour

    await service.updateOne(user.id, user);

    const projectSettingsService = new ProjectSettingsService({ schema: req.schema });
    const projectSettings = await projectSettingsService.readMany();
    const projectName = projectSettings[0].name;

    const mail = new MailService();
    mail.sendEmail(projectName, {
      to: user.email,
      subject: 'Reset Password',
      html: `${env.PUBLIC_SERVER_URL}/admin/auth/reset-password/${user.resetPasswordToken}`,
    });

    res.json({
      message: 'success',
    });
  })
);

const payload = (user: any) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isActive: user.isActive,
    apiKey: user.apiKey ? '********' : null,
    updatedAt: user.updatedAt,
    role: {
      id: user.roleId,
      name: user.roleName,
      description: user.roleDescription,
      adminAccess: user.roleAdminAccess,
    },
  };
};

export const users = router;
