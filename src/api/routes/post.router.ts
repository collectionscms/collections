import express, { Request, Response } from 'express';
import { env } from '../../env.js';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { projectPrisma } from '../database/prisma/client.js';
import { Translator } from '../integrations/translator.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { ContentRepository } from '../persistence/content/content.repository.js';
import { ContentHistoryRepository } from '../persistence/contentHistory/contentHistory.repository.js';
import { PostRepository } from '../persistence/post/post.repository.js';
import { ProjectRepository } from '../persistence/project/project.repository.js';
import { TranslationUsageRepository } from '../persistence/translationUsage/translationUsage.repository.js';
import { createContentUseCaseSchema } from '../useCases/content/createContent.schema.js';
import { CreateContentUseCase } from '../useCases/content/createContent.useCase.js';
import { translateContentUseCaseSchema } from '../useCases/content/translateContent.schema.js';
import { TranslateContentUseCase } from '../useCases/content/translateContent.useCase.js';
import { trashLanguageContentUseCaseSchema } from '../useCases/content/trashLanguageContent.schema.js';
import { TrashLanguageContentUseCase } from '../useCases/content/trashLanguageContent.useCase.js';
import { createPostUseCaseSchema } from '../useCases/post/createPost.schema.js';
import { CreatePostUseCase } from '../useCases/post/createPost.useCase.js';
import { getPostsUseCaseSchema } from '../useCases/post/getPosts.schema.js';
import { GetPostsUseCase } from '../useCases/post/getPosts.useCase.js';
import { trashPostUseCaseSchema } from '../useCases/post/trashPost.schema.js';
import { TrashPostUseCase } from '../useCases/post/trashPost.useCase.js';

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

router.post(
  '/posts/:id/translate',
  authenticatedUser,
  validateAccess(['updatePost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = translateContentUseCaseSchema.safeParse({
      id: req.params.id,
      userId: res.user.id,
      projectId: res.projectRole?.id,
      sourceLanguage: req.body.sourceLanguage,
      targetLanguage: req.body.targetLanguage,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new TranslateContentUseCase(
      projectPrisma(validated.data.projectId),
      new ContentRepository(),
      new TranslationUsageRepository(),
      new Translator(env.DEEPL_API_KEY)
    );
    const response = await useCase.execute(validated.data);

    res.json({
      ...response,
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
      new ContentHistoryRepository()
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
