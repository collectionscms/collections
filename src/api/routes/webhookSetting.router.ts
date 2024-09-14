import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { WebhookSettingRepository } from '../persistence/webhookSetting/webhookSetting.repository.js';
import { getWebSettingsUseCaseSchema } from '../useCases/webSetting/getWebSettings.schema.js';
import { GetWebSettingsUseCase } from '../useCases/webSetting/getWebSettings.useCase.js';

const router = express.Router();

router.get(
  '/webhook-settings',
  authenticatedUser,
  validateAccess(['readWebhookSetting']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getWebSettingsUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetWebSettingsUseCase(
      projectPrisma(validated.data.projectId),
      new WebhookSettingRepository()
    );
    const webhookSettings = await useCase.execute();

    res.json({
      webhookSettings,
    });
  })
);

export const webhookSetting = router;
