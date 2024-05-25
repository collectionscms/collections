import express, { Request, Response } from 'express';
import { env } from '../../env.js';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { ContentRepository } from '../data/content/content.repository.js';
import { PostRepository } from '../data/post/post.repository.js';
import { PostHistoryRepository } from '../data/postHistory/postHistory.repository.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { changeStatusUseCaseSchema } from '../useCases/post/changeStatus.schema.js';
import { ChangeStatusUseCase } from '../useCases/post/changeStatus.useCase.js';
import { createPostUseCaseSchema } from '../useCases/post/createPost.schema.js';
import { CreatePostUseCase } from '../useCases/post/createPost.useCase.js';
import { deletePostUseCaseSchema } from '../useCases/post/deletePost.schema.js';
import { DeletePostUseCase } from '../useCases/post/deletePost.useCase.js';
import { getPostUseCaseSchema } from '../useCases/post/getPost.schema.js';
import { GetPostUseCase } from '../useCases/post/getPost.useCase.js';
import { getPostsUseCaseSchema } from '../useCases/post/getPosts.schema.js';
import { GetPostsUseCase } from '../useCases/post/getPosts.useCase.js';
import { updatePostUseCaseSchema } from '../useCases/post/updatePost.schema.js';
import { UpdatePostUseCase } from '../useCases/post/updatePost.useCase.js';

const router = express.Router();

router.get(
  '/posts',
  authenticatedUser,
  validateAccess(['readPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const locale = req.headers['accept-language'] || env.DEFAULT_LOCALE;
    const validated = getPostsUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      locale,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetPostsUseCase(
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
  validateAccess(['readPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const locale = req.headers['accept-language'] || env.DEFAULT_LOCALE;

    const validated = getPostUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      postId: req.params.id,
      locale,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetPostUseCase(
      projectPrisma(validated.data.projectId),
      new PostRepository()
    );
    const post = await useCase.execute(validated.data);

    res.json({
      post,
    });
  })
);

router.post(
  '/posts',
  authenticatedUser,
  validateAccess(['createPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const locale = req.headers['accept-language'] || env.DEFAULT_LOCALE;

    const validated = createPostUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      userId: res.user.id,
      locale,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new CreatePostUseCase(
      projectPrisma(validated.data.projectId),
      new PostRepository(),
      new ContentRepository()
    );
    const post = await useCase.execute(validated.data);

    res.json({
      post,
    });
  })
);

router.patch(
  '/posts/:id',
  authenticatedUser,
  validateAccess(['updatePost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = updatePostUseCaseSchema.safeParse({
      id: req.params.id,
      userId: res.user.id,
      projectId: res.projectRole?.id,
      status: req.body.status,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new UpdatePostUseCase(
      projectPrisma(validated.data.projectId),
      new PostRepository(),
      new PostHistoryRepository()
    );
    await useCase.execute(validated.data);

    res.status(204).send();
  })
);

router.delete(
  '/posts/:id',
  authenticatedUser,
  validateAccess(['deletePost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = deletePostUseCaseSchema.safeParse({
      id: req.params.id,
      projectId: res.projectRole?.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new DeletePostUseCase(
      projectPrisma(validated.data.projectId),
      new PostRepository()
    );
    await useCase.execute(validated.data);

    res.status(204).send();
  })
);

router.patch(
  '/posts/:id/changeStatus',
  authenticatedUser,
  validateAccess(['archivePost', 'publishPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = changeStatusUseCaseSchema.safeParse({
      id: req.params.id,
      projectId: res.projectRole?.id,
      userId: res.user.id,
      status: req.body.status,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new ChangeStatusUseCase(
      projectPrisma(validated.data.projectId),
      new PostRepository(),
      new PostHistoryRepository()
    );

    await useCase.execute(validated.data);

    res.status(204).send();
  })
);

export const post = router;
