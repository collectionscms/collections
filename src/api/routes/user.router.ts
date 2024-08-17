import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { InvitationRepository } from '../persistences/invitation/invitation.repository.js';
import { UserRepository } from '../persistences/user/user.repository.js';
import { UserProjectRepository } from '../persistences/userProject/userProject.repository.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { deleteUserProjectUseCaseSchema } from '../useCases/user/deleteUserProject.schema.js';
import { DeleteUserProjectUserUseCase } from '../useCases/user/deleteUserProject.useCase.js';
import { getUserProfileUseCaseSchema } from '../useCases/user/getUserProfile.schema.js';
import { GetUserProfileUseCase } from '../useCases/user/getUserProfile.useCase.js';
import { getUserProfilesUseCaseSchema } from '../useCases/user/getUserProfiles.schema.js';
import { GetUserProfilesUseCase } from '../useCases/user/getUserProfiles.useCase.js';
import { updateUserUseCaseSchema } from '../useCases/user/updateUser.schema.js';
import { UpdateUserUseCase } from '../useCases/user/updateUser.useCase.js';

const router = express.Router();

router.get(
  '/users',
  authenticatedUser,
  validateAccess(['readUser']),
  asyncHandler(async (_req: Request, res: Response) => {
    const validated = getUserProfilesUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetUserProfilesUseCase(
      projectPrisma(validated.data.projectId),
      new UserRepository(),
      new InvitationRepository()
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
  validateAccess(['readUser']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getUserProfileUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
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

router.patch(
  '/users/:id',
  authenticatedUser,
  validateAccess(['updateUser']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = updateUserUseCaseSchema.safeParse({
      id: req.params.id,
      projectId: res.projectRole?.id,
      roleId: req.body.roleId,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const userUseCase = new UpdateUserUseCase(
      projectPrisma(validated.data.projectId),
      new UserProjectRepository()
    );
    await userUseCase.execute(validated.data);

    res.status(204).end();
  })
);

router.delete(
  '/users/:id',
  authenticatedUser,
  validateAccess(['deleteUser']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = deleteUserProjectUseCaseSchema.safeParse({
      userId: req.params.id,
      projectId: res.projectRole?.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new DeleteUserProjectUserUseCase(
      projectPrisma(validated.data.projectId),
      new UserProjectRepository()
    );
    await useCase.execute(validated.data.userId);

    res.status(204).end();
  })
);

export const user = router;
