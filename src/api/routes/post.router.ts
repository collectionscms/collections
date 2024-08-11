import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { ContentRepository } from '../data/content/content.repository.js';
import { ContentHistoryRepository } from '../data/contentHistory/contentHistory.repository.js';
import { PostRepository } from '../data/post/post.repository.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { createBulkContentUseCaseSchema } from '../useCases/content/createBulkContent.schema.js';
import { CreateBulkContentUseCase } from '../useCases/content/createBulkContent.useCase.js';
import { createContentUseCaseSchema } from '../useCases/content/createContent.schema.js';
import { CreateContentUseCase } from '../useCases/content/createContent.useCase.js';
import { trashLocaleContentUseCaseSchema } from '../useCases/content/trashLocaleContent.schema.js';
import { TrashLocaleContentUseCase } from '../useCases/content/trashLocaleContent.useCase.js';
import { createPostUseCaseSchema } from '../useCases/post/createPost.schema.js';
import { CreatePostUseCase } from '../useCases/post/createPost.useCase.js';
import { getPostUseCaseSchema } from '../useCases/post/getPost.schema.js';
import { GetPostUseCase } from '../useCases/post/getPost.useCase.js';
import { getPostsUseCaseSchema } from '../useCases/post/getPosts.schema.js';
import { GetPostsUseCase } from '../useCases/post/getPosts.useCase.js';
import { trashPostUseCaseSchema } from '../useCases/post/trashPost.schema.js';
import { TrashPostUseCase } from '../useCases/post/trashPost.useCase.js';
import { updatePostUseCaseSchema } from '../useCases/post/updatePost.schema.js';
import { UpdatePostUseCase } from '../useCases/post/updatePost.useCase.js';

const router = express.Router();

router.get(
  '/posts',
  authenticatedUser,
  validateAccess(['readOwnPost', 'readAllPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getPostsUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      primaryLocale: res.projectRole?.primaryLocale,
      userId: res.user.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetPostsUseCase(
      projectPrisma(validated.data.projectId),
      new PostRepository()
    );

    const permissions = res.projectRole?.permissions ?? [];
    const hasReadAllPost = permissions.map((p) => p.action).includes('readAllPost');
    const posts = await useCase.execute(validated.data, hasReadAllPost);

    res.json({ posts });
  })
);

router.get(
  '/posts/:id',
  authenticatedUser,
  validateAccess(['readOwnPost', 'readAllPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const locale = req.query.locale || res.projectRole?.primaryLocale;

    const validated = getPostUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      postId: req.params.id,
      userId: res.user.id,
      locale: locale,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetPostUseCase(
      projectPrisma(validated.data.projectId),
      new PostRepository()
    );

    const permissions = res.projectRole?.permissions ?? [];
    const hasReadAllPost = permissions.map((p) => p.action).includes('readAllPost');
    const post = await useCase.execute(validated.data, hasReadAllPost);

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
    const validated = createPostUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      userId: res.user.id,
      primaryLocale: res.projectRole?.primaryLocale,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new CreatePostUseCase(
      projectPrisma(validated.data.projectId),
      new PostRepository(),
      new ContentRepository(),
      new ContentHistoryRepository()
    );
    const post = await useCase.execute(validated.data);

    res.json({
      post,
    });
  })
);

router.post(
  '/posts/:id/contents',
  authenticatedUser,
  validateAccess(['createPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = createContentUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      id: req.params.id,
      locale: req.body.locale,
      userId: res.user.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new CreateContentUseCase(
      projectPrisma(validated.data.projectId),
      new ContentRepository(),
      new ContentHistoryRepository()
    );
    const content = await useCase.execute(validated.data);

    res.json({
      content,
    });
  })
);

router.post(
  '/posts/:id/contents/bulk',
  authenticatedUser,
  validateAccess(['createPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = createBulkContentUseCaseSchema.safeParse({
      postId: req.params.id,
      projectId: res.projectRole?.id,
      userId: res.user.id,
      locales: req.body.locales,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new CreateBulkContentUseCase(
      projectPrisma(validated.data.projectId),
      new ContentRepository(),
      new ContentHistoryRepository()
    );
    await useCase.execute(validated.data);
    res.status(204).send();
  })
);

router.delete(
  '/posts/:id/locales/:locale',
  authenticatedUser,
  validateAccess(['trashPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = trashLocaleContentUseCaseSchema.safeParse({
      postId: req.params.id,
      projectId: res.projectRole?.id,
      userId: res.user.id,
      locale: req.params.locale,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new TrashLocaleContentUseCase(
      projectPrisma(validated.data.projectId),
      new ContentRepository(),
      new ContentHistoryRepository()
    );
    await useCase.execute(validated.data);
    res.status(204).send();
  })
);

router.patch(
  '/posts/:id',
  authenticatedUser,
  validateAccess(['updatePost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = updatePostUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      postId: req.params.id,
      slug: req.body.slug,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new UpdatePostUseCase(
      projectPrisma(validated.data.projectId),
      new PostRepository()
    );
    await useCase.execute(validated.data);

    res.status(204).send();
  })
);

router.delete(
  '/posts/:id/trash',
  authenticatedUser,
  validateAccess(['trashPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = trashPostUseCaseSchema.safeParse({
      id: req.params.id,
      projectId: res.projectRole?.id,
      userId: res.user.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new TrashPostUseCase(
      projectPrisma(validated.data.projectId),
      new ContentRepository(),
      new ContentHistoryRepository()
    );
    await useCase.execute(validated.data);

    res.status(204).send();
  })
);

export const post = router;
