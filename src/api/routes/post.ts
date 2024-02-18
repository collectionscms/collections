import express, { Request, Response } from 'express';
import { env } from '../../env.js';
import { InvalidQueryException } from '../../exceptions/invalidQuery.js';
import { ContentRepository } from '../data/content/content.repository.js';
import { PostRepository } from '../data/post/post.repository.js';
import { prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticatedUser } from '../middleware/auth.js';
import { CreatePostUseCase } from '../useCases/post/createPost.js';

const router = express.Router();

router.get(
  '/posts',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const locale = req.headers['accept-language'] || env.DEFAULT_LOCALE;
    const projectId = res.user.projects[0].id;

    const repository = new PostRepository();
    const records = await repository.findManyByProjectId(prisma, projectId);

    const posts = records.map((record) => {
      return record.post.toResponse(locale, record.contents, record.createdBy);
    });

    res.json({ posts });
  })
);

router.get(
  '/posts/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const locale = req.headers['accept-language'] || env.DEFAULT_LOCALE;
    const id = req.params.id;
    const projectId = req.res?.user.projects[0].id;

    if (!projectId || !id) {
      throw new InvalidQueryException();
    }

    const repository = new PostRepository();
    const record = await repository.findOneById(prisma, projectId, id);
    const post = record.post.toResponse(locale, record.contents, record.createdBy);

    res.json({
      post,
    });
  })
);

router.post(
  '/posts',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const locale = req.headers['accept-language'] || env.DEFAULT_LOCALE;
    const projectId = req.res?.user.projects[0].id;
    const userId = req.res?.user.id;

    if (!projectId || !userId) {
      throw new InvalidQueryException();
    }

    const useCase = new CreatePostUseCase(prisma, new PostRepository(), new ContentRepository());
    const post = await useCase.execute(projectId, userId, locale);

    res.json({
      post,
    });
  })
);

export const post = router;
