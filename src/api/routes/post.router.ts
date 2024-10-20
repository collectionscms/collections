import { Translator } from '@collectionscms/plugin-text-generator';
import express, { Request, Response } from 'express';
import { env } from '../../env.js';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { ContentRepository } from '../persistence/content/content.repository.js';
import { ContentRevisionRepository } from '../persistence/contentRevision/contentRevision.repository.js';
import { PermissionEntity } from '../persistence/permission/permission.entity.js';
import { PostRepository } from '../persistence/post/post.repository.js';
import { ProjectRepository } from '../persistence/project/project.repository.js';
import { TextGenerationUsageRepository } from '../persistence/textGenerationUsage/textGenerationUsage.repository.js';
import { UserRepository } from '../persistence/user/user.repository.js';
import { WebhookLogRepository } from '../persistence/webhookLog/webhookLog.repository.js';
import { WebhookSettingRepository } from '../persistence/webhookSetting/webhookSetting.repository.js';
import { WebhookService } from '../services/webhook.service.js';
import { CreateContentUseCase } from '../useCases/content/createContent.useCase.js';
import { createContentUseCaseSchema } from '../useCases/content/createContent.useCase.schema.js';
import { CreatePostUseCase } from '../useCases/post/createPost.useCase.js';
import { createPostUseCaseSchema } from '../useCases/post/createPost.useCase.schema.js';
import { GetPostsUseCase } from '../useCases/post/getPosts.useCase.js';
import { getPostsUseCaseSchema } from '../useCases/post/getPosts.useCase.schema.js';
import { TranslateContentUseCase } from '../useCases/post/translateContent.useCase.js';
import { translateContentUseCaseSchema } from '../useCases/post/translateContent.useCase.schema.js';
import { TrashPostUseCase } from '../useCases/post/trashPost.useCase.js';
import { trashPostUseCaseSchema } from '../useCases/post/trashPost.useCase.schema.js';

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
      isAdmin: res.projectRole?.isAdmin,
      permissions: res.projectRole?.permissions,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetPostsUseCase(
      projectPrisma(validated.data.projectId),
      new PostRepository()
    );

    const hasReadAllPost =
      validated.data.isAdmin ||
      PermissionEntity.hasPermission(validated.data.permissions, 'readAllPost');
    const posts = await useCase.execute(validated.data, hasReadAllPost);

    res.json({ posts });
  })
);

router.post(
  '/posts',
  authenticatedUser,
  validateAccess(['savePost']),
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
      new ContentRevisionRepository()
    );
    const content = await useCase.execute(validated.data);

    res.json({
      content,
    });
  })
);

router.post(
  '/posts/:id/contents',
  authenticatedUser,
  validateAccess(['savePost']),
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
      new ContentRevisionRepository()
    );
    const content = await useCase.execute(validated.data);

    res.json({
      content,
    });
  })
);

router.post(
  '/posts/:id/translate',
  authenticatedUser,
  validateAccess(['savePost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = translateContentUseCaseSchema.safeParse({
      id: req.params.id,
      projectId: res.projectRole?.id,
      userId: res.user.id,
      sourceLanguage: req.body.sourceLanguage,
      targetLanguage: req.body.targetLanguage,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new TranslateContentUseCase(
      projectPrisma(validated.data.projectId),
      new ContentRevisionRepository(),
      new TextGenerationUsageRepository(),
      new Translator(env.TRANSLATOR_API_KEY)
    );
    const response = await useCase.execute(validated.data);

    res.json({
      ...response,
    });
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
      new ContentRevisionRepository(),
      new WebhookService(
        new WebhookSettingRepository(),
        new WebhookLogRepository(),
        new UserRepository()
      )
    );
    await useCase.execute(validated.data);

    res.status(204).send();
  })
);

export const post = router;
