/* eslint-disable max-len */
import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../../../exceptions/invalidPayload.js';
import { projectPrisma } from '../../../database/prisma/client.js';
import { asyncHandler } from '../../../middlewares/asyncHandler.js';
import { authenticatedUser } from '../../../middlewares/auth.js';
import { validateAccess } from '../../../middlewares/validateAccess.js';
import { ContentRepository } from '../../../persistence/content/content.repository.js';
import { UserProjectRepository } from '../../../persistence/userProject/userProject.repository.js';
import { GetUserPublishedListContentsUseCase } from '../../../useCases/user/getUserPublishedListContents.useCase.js';
import { getUserPublishedListContentsUseCaseSchema } from '../../../useCases/user/getUserPublishedListContents.useCase.schema.js';

export const router = express.Router();

router.get(
  '/users/:id/contents',
  authenticatedUser,
  validateAccess(['readPublishedPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getUserPublishedListContentsUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      id: req.params.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetUserPublishedListContentsUseCase(
      projectPrisma(validated.data.projectId),
      new UserProjectRepository(),
      new ContentRepository()
    );
    const contents = await useCase.execute(validated.data);

    res.json({ contents });
  })
);

export const user = router;
