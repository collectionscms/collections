import express, { Request, Response } from 'express';
import { env } from '../../env.js';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { ContentRepository } from '../data/content/content.repository.js';
import { PostRepository } from '../data/post/post.repository.js';
import { PostHistoryRepository } from '../data/postHistory/postHistory.repository.js';
import { prisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { authenticatedUser } from '../middleware/auth.js';
import { CreatePostUseCase } from '../useCases/post/createPost.js';
import { DeletePostUseCase } from '../useCases/post/deletePost.js';
import { UpdatePostUseCase } from '../useCases/post/updatePost.js';
import { updatePostUseCaseSchema } from '../useCases/post/updatePost.schema.js';

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
      throw new InvalidPayloadException('bad_request');
    }

    const repository = new PostRepository();
    const record = await repository.findOneWithContentsById(prisma, projectId, id);
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
      throw new InvalidPayloadException('bad_request');
    }

    const useCase = new CreatePostUseCase(
      prisma,
      new PostRepository(),
      new ContentRepository(),
      new PostHistoryRepository()
    );
    const result = await useCase.execute(projectId, userId, locale);
    const post = result.post.toResponse(locale, result.contents, result.createdBy);

    res.json({
      post,
    });
  })
);

router.patch(
  '/posts/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = req.res?.user.projects[0].id;
    const id = req.params.id;

    const validated = updatePostUseCaseSchema.safeParse({
      id,
      projectId,
      ...req.body,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new UpdatePostUseCase(
      prisma,
      new PostRepository(),
      new PostHistoryRepository()
    );
    await useCase.execute(validated.data.projectId, validated.data.id, req.body);

    res.status(204).send();
  })
);

router.delete(
  '/posts/:id',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const projectId = req.res?.user.projects[0].id;
    const id = req.params.id;

    if (!projectId || !id) {
      throw new InvalidPayloadException('bad_request');
    }

    const useCase = new DeletePostUseCase(prisma, new PostRepository());
    await useCase.execute(projectId, id);

    res.status(204).send();
  })
);

export const post = router;