import { z } from 'zod';
import { WebhookProvider } from '../../persistence/webhookSetting/webhookSetting.entity.js';

export const createWebSettingsUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  name: z.string(),
  provider: z.nativeEnum(WebhookProvider),
  url: z.string().url().nullable(),
  onPublish: z.boolean(),
  onArchive: z.boolean(),
  onDeletePublished: z.boolean(),
  onRestorePublished: z.boolean(),
  onRevert: z.boolean(),
});

export type CreateWebSettingsUseCaseSchemaType = z.infer<typeof createWebSettingsUseCaseSchema>;
