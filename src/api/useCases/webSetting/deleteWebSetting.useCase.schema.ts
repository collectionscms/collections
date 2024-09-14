import { z } from 'zod';

export const deleteWebSettingsUseCaseSchema = z.object({
  projectId: z.string(),
  id: z.string(),
});

export type DeleteWebSettingsUseCaseSchemaType = z.infer<typeof deleteWebSettingsUseCaseSchema>;
