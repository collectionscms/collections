import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../../../exceptions/invalidPayload.js';
import { projectPrisma } from '../../../database/prisma/client.js';
import { asyncHandler } from '../../../middlewares/asyncHandler.js';
import { authenticatedUser } from '../../../middlewares/auth.js';
import { validateAccess } from '../../../middlewares/validateAccess.js';
import { PostRepository } from '../../../persistences/post/post.repository.js';
import { getPublishedPostsUseCaseSchema } from '../../../useCases/post/getPublishedPosts.schema.js';
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

export const post = router;
