import { z } from 'zod';

export const updateWebSettingsUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  name: z.string(),
  enabled: z.boolean(),
  url: z.string().url().nullable(),
  onPublish: z.boolean(),
  onArchive: z.boolean(),
  onUpdatePublished: z.boolean(),
  onDeletePublished: z.boolean(),
});

export type UpdateWebSettingsUseCaseSchemaType = z.infer<typeof updateWebSettingsUseCaseSchema>;
