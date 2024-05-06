import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { UnprocessableEntityException } from '../../exceptions/unprocessableEntity.js';
import { UserRepository } from '../data/user/user.repository.js';
import { prisma, projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { createUserUseCaseSchema } from '../useCases/ user/createUser.schema.js';
import { CreateUserUseCase } from '../useCases/ user/createUser.useCase.js';
import { deleteUserUseCaseSchema } from '../useCases/ user/deleteUser.schema.js';
import { DeleteUserUseCase } from '../useCases/ user/deleteUser.useCase.js';
import { getUserProfileUseCaseSchema } from '../useCases/ user/getUserProfile.schema.js';
import { GetUserProfileUseCase } from '../useCases/ user/getUserProfile.useCase.js';
import { getUserProfilesUseCaseSchema } from '../useCases/ user/getUserProfiles.schema.js';
import { GetUserProfilesUseCase } from '../useCases/ user/getUserProfiles.useCase.js';
import { updateUserUseCaseSchema } from '../useCases/ user/updateUser.schema.js';
import { UpdateUserUseCase } from '../useCases/ user/updateUser.useCase.js';

const router = express.Router();

router.get(
  '/users',
  authenticatedUser,
  asyncHandler(async (_req: Request, res: Response) => {
    const validated = getUserProfilesUseCaseSchema.safeParse({
      projectId: res.tenantProjectId,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetUserProfilesUseCase(
      projectPrisma(validated.data.projectId),
      new UserRepository()
    );
    const users = await useCase.execute();

    res.json({
      users,
    });
  })
);

router.get(
  '/users/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getUserProfileUseCaseSchema.safeParse({
      projectId: res.tenantProjectId,
      userId: req.params.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetUserProfileUseCase(
      projectPrisma(validated.data.projectId),
      new UserRepository()
    );
    const user = await useCase.execute(validated.data.userId);

    res.json({
      user,
    });
  })
);

router.post(
  '/users',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const validated = createUserUseCaseSchema.safeParse({
      projectId: res.tenantProjectId,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      roleId: req.body.roleId,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new CreateUserUseCase(
      prisma,
      projectPrisma(validated.data.projectId),
      new UserRepository()
    );
    const user = await useCase.execute(validated.data);

    res.json({
      user,
    });
  })
);

router.patch(
  '/users/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const validated = updateUserUseCaseSchema.safeParse({
      id: req.params.id,
      projectId: res.tenantProjectId,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      roleId: req.body.roleId,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const userUseCase = new UpdateUserUseCase(
      prisma,
      projectPrisma(validated.data.projectId),
      new UserRepository()
    );
    await userUseCase.execute(validated.data);

    res.status(204).end();
  })
);

router.delete(
  '/users/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const validated = deleteUserUseCaseSchema.safeParse({
      userId: req.params.id,
      projectId: res.tenantProjectId,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new DeleteUserUseCase(
      projectPrisma(validated.data.projectId),
      new UserProjectRepository()
    );
    await useCase.execute(validated.data.projectId, validated.data.userId);

    res.status(204).end();
  })
);

export const user = router;
