import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { ContentRepository } from '../data/content/content.repository.js';
import { PostRepository } from '../data/post/post.repository.js';
import { PostHistoryRepository } from '../data/postHistory/postHistory.repository.js';
import { prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticatedUser } from '../middleware/auth.js';
import { UpdateContentUseCase } from '../useCases/content/updateContent.useCase.js';
import { updateContentUseCaseSchema } from '../useCases/content/updateContent.schema.js';

const router = express.Router();

router.patch(
  '/contents/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const projectId = req.res?.user.projects[0].id;

    const validated = updateContentUseCaseSchema.safeParse({
      projectId,
      id,
      ...req.body,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new UpdateContentUseCase(
      prisma,
      new PostRepository(),
      new ContentRepository(),
      new PostHistoryRepository()
    );
    await useCase.execute(validated.data.id, validated.data.projectId, {
      title: validated.data.title,
      body: validated.data.body,
      bodyJson: validated.data.bodyJson,
      bodyHtml: validated.data.bodyHtml,
    });

    res.status(204).send();
  })
);

export const content = router;
