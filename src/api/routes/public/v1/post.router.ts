import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../../../exceptions/invalidPayload.js';
import { projectPrisma } from '../../../database/prisma/client.js';
import { asyncHandler } from '../../../middlewares/asyncHandler.js';
import { authenticatedUser } from '../../../middlewares/auth.js';
import { validateAccess } from '../../../middlewares/validateAccess.js';
import { PostRepository } from '../../../persistence/post/post.repository.js';
import { getPublishedPostUseCaseSchema } from '../../../useCases/post/getPublishedPost.useCase.schema.js';
import { GetPublishedPostUseCase } from '../../../useCases/post/getPublishedPost.useCase.js';
import { getPublishedPostsUseCaseSchema } from '../../../useCases/post/getPublishedPosts.useCase.schema.js';
import { GetPublishedPostsUseCase } from '../../../useCases/post/getPublishedPosts.useCase.js';

const router = express.Router();

router.get(
  '/posts',
  authenticatedUser,
  validateAccess(['readPublishedPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getPublishedPostsUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      language: req.query?.language,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetPublishedPostsUseCase(
      projectPrisma(validated.data.projectId),
      new PostRepository()
    );
    const posts = await useCase.execute(validated.data);

    res.json({ posts });
  })
);

router.get(
  '/posts/:id',
  authenticatedUser,
  validateAccess(['readPublishedPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getPublishedPostUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      language: req.query?.language,
      id: req.params.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetPublishedPostUseCase(
      projectPrisma(validated.data.projectId),
      new PostRepository()
    );
    const post = await useCase.execute(validated.data);

    res.json({ post });
  })
);

export const post = router;
