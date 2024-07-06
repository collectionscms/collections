import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { PostRepository } from '../data/post/post.repository.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { getTrashedPostsUseCaseSchema } from '../useCases/post/getTrashedPosts.schema.js';
import { GetTrashedPostsUseCase } from '../useCases/post/getTrashedPosts.useCase.js';
import { restorePostUseCaseSchema } from '../useCases/post/restorePost.schema.js';
import { RestorePostUseCase } from '../useCases/post/restorePost.useCase.js';

const router = express.Router();

router.get(
  '/trashedPosts',
  authenticatedUser,
  validateAccess(['trashPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getTrashedPostsUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      primaryLocale: res.projectRole?.primaryLocale,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetTrashedPostsUseCase(
      projectPrisma(validated.data.projectId),
      new PostRepository()
    );
    const posts = await useCase.execute(validated.data);

    res.json({
      posts,
    });
  })
);

router.patch(
  '/trashedPosts/:id/restore',
  authenticatedUser,
  validateAccess(['trashPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = restorePostUseCaseSchema.safeParse({
      id: req.params.id,
      projectId: res.projectRole?.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new RestorePostUseCase(
      projectPrisma(validated.data.projectId),
      new PostRepository()
    );
    await useCase.execute(validated.data);

    res.status(204).send();
  })
);

export const trash = router;
