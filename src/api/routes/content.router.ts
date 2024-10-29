import { TextGenerator, Translator } from '@collectionscms/plugin-text-generator';
import express, { Request, Response } from 'express';
import { env } from '../../env.js';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { ContentRepository } from '../persistence/content/content.repository.js';
import { ContentRevisionRepository } from '../persistence/contentRevision/contentRevision.repository.js';
import { ContentTagRepository } from '../persistence/contentTag/contentTag.repository.js';
import { ProjectRepository } from '../persistence/project/project.repository.js';
import { ReviewRepository } from '../persistence/review/review.repository.js';
import { TagRepository } from '../persistence/tag/tag.repository.js';
import { TextGenerationUsageRepository } from '../persistence/textGenerationUsage/textGenerationUsage.repository.js';
import { UserRepository } from '../persistence/user/user.repository.js';
import { WebhookLogRepository } from '../persistence/webhookLog/webhookLog.repository.js';
import { WebhookSettingRepository } from '../persistence/webhookSetting/webhookSetting.repository.js';
import { ContentService } from '../services/content.service.js';
import { TextGenerationService } from '../services/textGeneration.service.js';
import { WebhookService } from '../services/webhook.service.js';
import { ArchiveUseCase } from '../useCases/content/archive.useCase.js';
import { archiveUseCaseSchema } from '../useCases/content/archive.useCase.schema.js';
import { CreateContentTagsUseCase } from '../useCases/content/createContentTags.useCase.js';
import { createContentTagsUseCaseSchema } from '../useCases/content/createContentTags.useCase.schema.js';
import { GenerateSeoUseCase } from '../useCases/content/generateSeo.useCase.js';
import { generateSeoUseCaseSchema } from '../useCases/content/generateSeo.useCase.schema.js';
import { GetContentUseCase } from '../useCases/content/getContent.useCase.js';
import { getContentUseCaseSchema } from '../useCases/content/getContent.useCase.schema.js';
import { GetTrashedContentsUseCase } from '../useCases/content/getTrashedContents.useCase.js';
import { getTrashedContentsUseCaseSchema } from '../useCases/content/getTrashedContents.useCase.schema.js';
import { PublishUseCase } from '../useCases/content/publish.useCase.js';
import { publishUseCaseSchema } from '../useCases/content/publish.useCase.schema.js';
import { RequestReviewUseCase } from '../useCases/content/requestReview.useCase.js';
import { requestReviewUseCaseSchema } from '../useCases/content/requestReview.useCase.schema.js';
import { RestoreContentUseCase } from '../useCases/content/restoreContent.useCase.js';
import { restoreContentUseCaseSchema } from '../useCases/content/restoreContent.useCase.schema.js';
import { RevertContentUseCase } from '../useCases/content/revertContent.useCase.js';
import { revertContentUseCaseSchema } from '../useCases/content/revertContent.useCase.schema.js';
import { TrashContentUseCase } from '../useCases/content/trashContent.useCase.js';
import { trashContentUseCaseSchema } from '../useCases/content/trashContent.useCase.schema.js';
import { UpdateContentUseCase } from '../useCases/content/updateContent.useCase.js';
import { updateContentUseCaseSchema } from '../useCases/content/updateContent.useCase.schema.js';

const router = express.Router();

router.get(
  '/contents/:id',
  authenticatedUser,
  validateAccess(['savePost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getContentUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      contentId: req.params.id,
      userId: res.user.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetContentUseCase(
      projectPrisma(validated.data.projectId),
      new ProjectRepository(),
      new ContentRepository(),
      new ContentTagRepository()
    );

    const content = await useCase.execute(validated.data);

    res.json({
      content,
    });
  })
);

router.get(
  '/trash/contents',
  authenticatedUser,
  validateAccess(['trashPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getTrashedContentsUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetTrashedContentsUseCase(
      projectPrisma(validated.data.projectId),
      new ContentRevisionRepository()
    );
    const contents = await useCase.execute();

    res.json({
      contents,
    });
  })
);

router.patch(
  '/contents/:id',
  authenticatedUser,
  validateAccess(['savePost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = updateContentUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      id: req.params.id,
      userId: res.user.id,
      title: req.body.title,
      subtitle: req.body.subtitle,
      body: req.body.body,
      bodyJson: req.body.bodyJson,
      bodyHtml: req.body.bodyHtml,
      coverUrl: req.body.coverUrl,
      slug: req.body.slug,
      metaTitle: req.body.metaTitle,
      metaDescription: req.body.metaDescription,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new UpdateContentUseCase(
      projectPrisma(validated.data.projectId),
      new ContentRevisionRepository()
    );
    await useCase.execute(validated.data);

    res.status(204).send();
  })
);

router.post(
  '/contents/:id/generate-seo',
  authenticatedUser,
  validateAccess(['savePost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = generateSeoUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      id: req.params.id,
      userId: res.user.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GenerateSeoUseCase(
      projectPrisma(validated.data.projectId),
      new ContentRepository(),
      new ContentRevisionRepository(),
      new TextGenerationUsageRepository(),
      new TextGenerationService(new Translator(env.TRANSLATOR_API_KEY)),
      new TextGenerator(env.TEXT_GENERATOR_API_KEY, env.TEXT_GENERATOR_MODEL)
    );
    const seo = await useCase.execute(validated.data);

    res.json({
      seo,
    });
  })
);

router.post(
  '/contents/:id/tags',
  authenticatedUser,
  validateAccess(['savePost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = createContentTagsUseCaseSchema.safeParse({
      id: req.params.id,
      projectId: res.projectRole?.id,
      names: req.body.names,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new CreateContentTagsUseCase(
      projectPrisma(validated.data.projectId),
      new ContentTagRepository(),
      new TagRepository()
    );
    const tags = await useCase.execute(validated.data);

    res.json({
      tags,
    });
  })
);

router.patch(
  '/contents/:id/request-review',
  authenticatedUser,
  validateAccess(['savePost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = requestReviewUseCaseSchema.safeParse({
      id: req.params.id,
      projectId: res.projectRole?.id,
      userId: res.user.id,
      comment: req.body.comment,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new RequestReviewUseCase(
      projectPrisma(validated.data.projectId),
      new ContentRepository(),
      new ContentRevisionRepository(),
      new ReviewRepository()
    );
    await useCase.execute(validated.data);

    res.status(204).send();
  })
);

router.patch(
  '/contents/:id/publish',
  authenticatedUser,
  validateAccess(['publishPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = publishUseCaseSchema.safeParse({
      id: req.params.id,
      projectId: res.projectRole?.id,
      userId: res.user.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new PublishUseCase(
      projectPrisma(validated.data.projectId),
      new ContentRepository(),
      new ContentService(new ContentRepository(), new ContentRevisionRepository()),
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

router.patch(
  '/contents/:id/archive',
  authenticatedUser,
  validateAccess(['archivePost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = archiveUseCaseSchema.safeParse({
      id: req.params.id,
      projectId: res.projectRole?.id,
      userId: res.user.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new ArchiveUseCase(
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

router.patch(
  '/contents/:id/restore',
  authenticatedUser,
  validateAccess(['trashPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = restoreContentUseCaseSchema.safeParse({
      id: req.params.id,
      projectId: res.projectRole?.id,
      userId: res.user.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new RestoreContentUseCase(
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

router.patch(
  '/contents/:id/revert',
  authenticatedUser,
  validateAccess(['savePost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = revertContentUseCaseSchema.safeParse({
      id: req.params.id,
      projectId: res.projectRole?.id,
      userId: res.user.id,
      contentRevisionId: req.body.contentRevisionId,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new RevertContentUseCase(
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

router.delete(
  '/contents/:id/trash',
  authenticatedUser,
  validateAccess(['trashPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = trashContentUseCaseSchema.safeParse({
      id: req.params.id,
      projectId: res.projectRole?.id,
      userId: res.user.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new TrashContentUseCase(
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

export const content = router;
