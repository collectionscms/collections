import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { UnprocessableEntityException } from '../../exceptions/unprocessableEntity.js';
import { UserEntity } from '../data/user/user.entity.js';
import { UserRepository } from '../data/user/user.repository.js';
import { prisma, projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticatedUser } from '../middleware/auth.js';
import { updateUserUseCaseSchema } from '../useCases/ user/updateUser.schema.js';
import { UpdateUserUseCase } from '../useCases/ user/updateUser.useCase.js';
import { oneWayHash } from '../utilities/oneWayHash.js';

const router = express.Router();

router.get(
  '/users',
  authenticatedUser,
  asyncHandler(async (_req: Request, res: Response) => {
    const projectId = res.user.projects[0].id;

    const repository = new UserRepository();
    const users = await repository.findUserProfiles(projectPrisma(projectId));

    res.json({
      users,
    });
  })
);

router.get(
  '/users/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = res.user.projects[0].id;

    const repository = new UserRepository();
    const user = await repository.findUserProfile(projectPrisma(projectId), req.params.id);

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
    const user = await repository.create(
      projectPrisma(projectId),
      entity,
      projectId,
      req.body.roleId
    );

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

    const userUseCase = new UpdateUserUseCase(
      prisma,
      projectPrisma(projectId),
      new UserRepository()
    );
    await userUseCase.execute(validated.data.id, validated.data.projectId, {
      name: validated.data.name,
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
    const projectId = res.user.projects[0].id;

    if (userId === id) {
      throw new UnprocessableEntityException('can_not_delete_itself');
    }

    const repository = new UserRepository();
    await repository.delete(projectPrisma(projectId), id);

    res.status(204).end();
  })
);

export const user = router;
