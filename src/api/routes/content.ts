import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { ContentRepository } from '../data/content/content.repository.js';
import { PostRepository } from '../data/post/post.repository.js';
import { PostHistoryRepository } from '../data/postHistory/postHistory.repository.js';
import { prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticatedUser } from '../middleware/auth.js';
import { createContentUseCaseSchema } from '../useCases/content/createContent.schema.js';
import { CreateContentUseCase } from '../useCases/content/createContent.useCase.js';
import { updateContentUseCaseSchema } from '../useCases/content/updateContent.schema.js';
import { UpdateContentUseCase } from '../useCases/content/updateContent.useCase.js';

const router = express.Router();

router.post(
  '/posts/:id/contents',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const projectId = req.res?.user.projects[0].id;

    const validated = createContentUseCaseSchema.safeParse({
      projectId,
      id,
      ...req.body,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new CreateContentUseCase(prisma, new ContentRepository());
    const content = await useCase.execute(validated.data.id, validated.data.projectId, {
      locale: validated.data.locale,
    });

    res.json({
      content: content.toResponse(),
    });
  })
);

router.patch(
  '/contents/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const projectId = req.res?.user.projects[0].id;
    const userName = req.res?.user.name;

    const validated = updateContentUseCaseSchema.safeParse({
      projectId,
      id,
      userName,
      ...req.body,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new UpdateContentUseCase(
      prisma,
      new PostRepository(),
      new ContentRepository(),
      new PostHistoryRepository()
    );
    await useCase.execute(validated.data.id, validated.data.projectId, validated.data.userName, {
      title: validated.data.title,
      body: validated.data.body,
      bodyJson: validated.data.bodyJson,
      bodyHtml: validated.data.bodyHtml,
    });

    res.status(204).send();
  })
);

export const content = router;
