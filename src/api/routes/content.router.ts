import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { ContentRepository } from '../data/content/content.repository.js';
import { PostRepository } from '../data/post/post.repository.js';
import { PostHistoryRepository } from '../data/postHistory/postHistory.repository.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { createContentUseCaseSchema } from '../useCases/content/createContent.schema.js';
import { CreateContentUseCase } from '../useCases/content/createContent.useCase.js';
import { updateContentUseCaseSchema } from '../useCases/content/updateContent.schema.js';
import { UpdateContentUseCase } from '../useCases/content/updateContent.useCase.js';

const router = express.Router();

router.post(
  '/posts/:id/contents',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const validated = createContentUseCaseSchema.safeParse({
      projectId: res.tenantProjectId,
      id: req.params.id,
      locale: req.body.locale,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new CreateContentUseCase(
      projectPrisma(validated.data.projectId),
      new ContentRepository()
    );
    const content = await useCase.execute(validated.data);

    res.json({
      content,
    });
  })
);

router.patch(
  '/contents/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const validated = updateContentUseCaseSchema.safeParse({
      projectId: res.tenantProjectId,
      id: req.params.id,
      userId: res.user.id,
      fileId: req.body.fileId,
      title: req.body.title,
      body: req.body.body,
      bodyJson: req.body.bodyJson,
      bodyHtml: req.body.bodyHtml,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new UpdateContentUseCase(
      projectPrisma(validated.data.projectId),
      new PostRepository(),
      new ContentRepository(),
      new PostHistoryRepository()
    );
    await useCase.execute(validated.data);

    res.status(204).send();
  })
);

export const content = router;
