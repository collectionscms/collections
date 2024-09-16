import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { ContentRepository } from '../persistence/content/content.repository.js';
import { ContentHistoryRepository } from '../persistence/contentHistory/contentHistory.repository.js';
import { PostRepository } from '../persistence/post/post.repository.js';
import { ProjectRepository } from '../persistence/project/project.repository.js';
import { createContentUseCaseSchema } from '../useCases/content/createContent.useCase.schema.js';
import { CreateContentUseCase } from '../useCases/content/createContent.useCase.js';
import { trashLanguageContentUseCaseSchema } from '../useCases/content/trashLanguageContent.useCase.schema.js';
import { TrashLanguageContentUseCase } from '../useCases/content/trashLanguageContent.useCase.js';
import { createPostUseCaseSchema } from '../useCases/post/createPost.useCase.schema.js';
import { CreatePostUseCase } from '../useCases/post/createPost.useCase.js';
import { getPostUseCaseSchema } from '../useCases/post/getPost.useCase.schema.js';
import { GetPostUseCase } from '../useCases/post/getPost.useCase.js';
import { getPostsUseCaseSchema } from '../useCases/post/getPosts.useCase.schema.js';
import { GetPostsUseCase } from '../useCases/post/getPosts.useCase.js';
import { trashPostUseCaseSchema } from '../useCases/post/trashPost.useCase.schema.js';
import { TrashPostUseCase } from '../useCases/post/trashPost.useCase.js';
import { WebhookSettingRepository } from '../persistence/webhookSetting/webhookSetting.repository.js';
import { WebhookService } from '../services/webhook.service.js';
import { WebhookLogRepository } from '../persistence/webhookLog/webhookLog.repository.js';

const router = express.Router();

router.get(
  '/posts',
  authenticatedUser,
  validateAccess(['readOwnPost', 'readAllPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getPostsUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      sourceLanguage: res.projectRole?.sourceLanguage,
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
    const language = req.query.language || res.projectRole?.sourceLanguage;

    const validated = getPostUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      postId: req.params.id,
      userId: res.user.id,
      language,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetPostUseCase(
      projectPrisma(validated.data.projectId),
      new ProjectRepository(),
      new PostRepository(),
      new ContentHistoryRepository()
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
      sourceLanguage: res.projectRole?.sourceLanguage,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new CreatePostUseCase(
      projectPrisma(validated.data.projectId),
      new ProjectRepository(),
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
      language: req.body.language,
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

router.delete(
  '/posts/:id/languages/:language',
  authenticatedUser,
  validateAccess(['trashPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = trashLanguageContentUseCaseSchema.safeParse({
      postId: req.params.id,
      projectId: res.projectRole?.id,
      userId: res.user.id,
      language: req.params.language,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new TrashLanguageContentUseCase(
      projectPrisma(validated.data.projectId),
      new ContentRepository(),
      new ContentHistoryRepository(),
      new WebhookService(new WebhookSettingRepository(), new WebhookLogRepository())
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
      new ContentHistoryRepository(),
      new WebhookService(new WebhookSettingRepository(), new WebhookLogRepository())
    );
    await useCase.execute(validated.data);

    res.status(204).send();
  })
);

export const post = router;
