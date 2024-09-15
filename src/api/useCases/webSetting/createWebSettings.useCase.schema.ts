import { z } from 'zod';
import { WebhookProvider } from '../../persistence/webhookSetting/webhookSetting.entity.js';

export const createWebSettingsUseCaseSchema = z.object({
  projectId: z.string(),
  name: z.string(),
  provider: z.nativeEnum(WebhookProvider),
  url: z.string().url().nullable(),
  onPublish: z.boolean(),
  onArchive: z.boolean(),
  onUpdatePublished: z.boolean(),
  onDeletePublished: z.boolean(),
});

export type CreateWebSettingsUseCaseSchemaType = z.infer<typeof createWebSettingsUseCaseSchema>;
