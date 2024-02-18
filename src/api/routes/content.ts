import express, { Request, Response } from 'express';
import { env } from '../../env.js';
import { InvalidQueryException } from '../../exceptions/invalidQuery.js';
import { ContentRepository } from '../data/content/content.repository.js';
import { PostRepository } from '../data/post/post.repository.js';
import { prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticatedUser } from '../middleware/auth.js';
import { UpdateContentUseCase } from '../useCases/content/updateContent.js';
import { PostHistoryRepository } from '../data/postHistory/postHistory.repository.js';

const router = express.Router();

router.patch(
  '/contents/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const locale = req.headers['accept-language'] || env.DEFAULT_LOCALE;
    const id = req.params.id;
    const projectId = req.res?.user.projects[0].id;

    if (!projectId || !id) {
      throw new InvalidQueryException();
    }

    const useCase = new UpdateContentUseCase(
      prisma,
      new PostRepository(),
      new ContentRepository(),
      new PostHistoryRepository()
    );
    await useCase.execute(id, projectId, req.body);

    res.status(204).send();
  })
);

export const content = router;
