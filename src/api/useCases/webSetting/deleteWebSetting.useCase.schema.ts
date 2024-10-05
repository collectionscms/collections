import { z } from 'zod';

export const deleteWebSettingsUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  id: z.string().uuid(),
});

export type DeleteWebSettingsUseCaseSchemaType = z.infer<typeof deleteWebSettingsUseCaseSchema>;
