import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { WebhookSettingRepository } from '../persistence/webhookSetting/webhookSetting.repository.js';
import { CreateWebSettingsUseCase } from '../useCases/webSetting/createWebSettings.useCase.js';
import { createWebSettingsUseCaseSchema } from '../useCases/webSetting/createWebSettings.useCase.schema.js';
import { GetWebSettingUseCase } from '../useCases/webSetting/getWebSetting.useCase.js';
import { getWebSettingUseCaseSchema } from '../useCases/webSetting/getWebSetting.useCase.schema.js';
import { GetWebSettingsUseCase } from '../useCases/webSetting/getWebSettings.useCase.js';
import { getWebSettingsUseCaseSchema } from '../useCases/webSetting/getWebSettings.useCase.schema.js';
import { UpdateWebSettingsUseCase } from '../useCases/webSetting/updateWebSettings.useCase.js';
import { updateWebSettingsUseCaseSchema } from '../useCases/webSetting/updateWebSettings.useCase.schema.js';

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

router.get(
  '/webhook-settings/:id',
  authenticatedUser,
  validateAccess(['readWebhookSetting']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getWebSettingUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      id: req.params.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetWebSettingUseCase(
      projectPrisma(validated.data.projectId),
      new WebhookSettingRepository()
    );
    const webhookSetting = await useCase.execute(validated.data);

    res.json({ webhookSetting });
  })
);

router.post(
  '/webhook-settings',
  authenticatedUser,
  validateAccess(['createWebhookSetting']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = createWebSettingsUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      name: req.body.name,
      provider: req.body.provider,
      url: req.body.url,
      onPublish: req.body.onPublish,
      onArchive: req.body.onArchive,
      onDeletePublished: req.body.onDeletePublished,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new CreateWebSettingsUseCase(
      projectPrisma(validated.data.projectId),
      new WebhookSettingRepository()
    );
    const webhookSetting = await useCase.execute(validated.data);

    res.json({ webhookSetting });
  })
);

router.patch(
  '/webhook-settings/:id',
  authenticatedUser,
  validateAccess(['updateWebhookSetting']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = updateWebSettingsUseCaseSchema.safeParse({
      id: req.params.id,
      projectId: res.projectRole?.id,
      enabled: req.body.enabled,
      url: req.body.url,
      name: req.body.name,
      onPublish: req.body.onPublish,
      onArchive: req.body.onArchive,
      onDeletePublished: req.body.onDeletePublished,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new UpdateWebSettingsUseCase(
      projectPrisma(validated.data.projectId),
      new WebhookSettingRepository()
    );
    await useCase.execute(validated.data);

    res.status(204).end();
  })
);

export const webhookSetting = router;
