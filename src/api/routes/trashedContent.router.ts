import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { ContentRepository } from '../persistence/content/content.repository.js';
import { PostRepository } from '../persistence/post/post.repository.js';
import { WebhookLogRepository } from '../persistence/webhookLog/webhookLog.repository.js';
import { WebhookSettingRepository } from '../persistence/webhookSetting/webhookSetting.repository.js';
import { WebhookService } from '../services/webhook.service.js';
import { GetTrashedContentsUseCase } from '../useCases/content/getTrashedContents.useCase.js';
import { getTrashedContentsUseCaseSchema } from '../useCases/content/getTrashedContents.useCase.schema.js';
import { RestoreContentUseCase } from '../useCases/content/restoreContent.useCase.js';
import { restoreContentUseCaseSchema } from '../useCases/content/restoreContent.useCase.schema.js';

const router = express.Router();

router.get(
  '/trashed/contents',
  authenticatedUser,
  validateAccess(['trashPost']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getTrashedContentsUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetTrashedContentsUseCase(
      projectPrisma(validated.data.projectId),
      new ContentRepository()
    );
    const contents = await useCase.execute();

    res.json({
      contents,
    });
  })
);

router.patch(
  '/trashed/contents/:id/restore',
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
      new PostRepository(),
      new ContentRepository(),
      new WebhookService(new WebhookSettingRepository(), new WebhookLogRepository())
    );
    await useCase.execute(validated.data);

    res.status(204).send();
  })
);

export const trashedContent = router;
