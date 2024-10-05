import { z } from 'zod';

export const updateWebSettingsUseCaseSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  name: z.string(),
  enabled: z.boolean(),
  url: z.string().url().nullable(),
  onPublish: z.boolean(),
  onArchive: z.boolean(),
  onDeletePublished: z.boolean(),
  onRestorePublished: z.boolean(),
});

export type UpdateWebSettingsUseCaseSchemaType = z.infer<typeof updateWebSettingsUseCaseSchema>;
