import { getSession } from '@auth/express';
import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { authConfig } from '../configs/auth.js';
import { bypassPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { UserRepository } from '../persistence/user/user.repository.js';
import { GetMyProfileUseCase } from '../useCases/me/getMyProfile.useCase.js';
import { getMyProfileUseCaseSchema } from '../useCases/me/getMyProfile.useCase.schema.js';
import { GetMyProjectsUseCase } from '../useCases/me/getMyProjects.useCase.js';
import { getMyProjectsUseCaseSchema } from '../useCases/me/getMyProjects.useCase.schema.js';
import { UpdateProfileUseCase } from '../useCases/me/updateProfile.useCase.js';
import { updateProfileUseCaseSchema } from '../useCases/me/updateProfile.useCase.schema.js';

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

    const useCase = new GetMyProfileUseCase(bypassPrisma, new UserRepository());
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
      name: req.body.name,
      bio: req.body.bio,
      image: req.body.image,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new UpdateProfileUseCase(bypassPrisma, new UserRepository());
    await useCase.execute(validated.data);

    res.status(204).end();
  })
);

export const me = router;
