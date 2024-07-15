import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { ContentRepository } from '../data/content/content.repository.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { getTrashedContentsUseCaseSchema } from '../useCases/content/getTrashedContents.schema.js';
import { GetTrashedContentsUseCase } from '../useCases/content/getTrashedContents.useCase.js';
import { restoreContentUseCaseSchema } from '../useCases/content/restoreContent.schema.js';
import { RestoreContentUseCase } from '../useCases/content/restoreContent.useCase.js';
import { ProjectRepository } from '../data/project/project.repository.js';
import { PostRepository } from '../data/post/post.repository.js';

const router = express.Router();

router.get(
  '/trashed/contents',
  authenticatedUser,
  validateAccess(['trashPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getTrashedContentsUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetTrashedContentsUseCase(
      projectPrisma(validated.data.projectId),
      new ContentRepository()
    );
    const contents = await useCase.execute();

    res.json({
      contents,
    });
  })
);

router.patch(
  '/trashed/contents/:id/restore',
  authenticatedUser,
  validateAccess(['trashPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = restoreContentUseCaseSchema.safeParse({
      id: req.params.id,
      projectId: res.projectRole?.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new RestoreContentUseCase(
      projectPrisma(validated.data.projectId),
      new PostRepository(),
      new ContentRepository()
    );
    await useCase.execute(validated.data);

    res.status(204).send();
  })
);

export const trashedContent = router;
