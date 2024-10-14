import { z } from 'zod';

export const getWebSettingsUseCaseSchema = z.object({
  projectId: z.string().uuid(),
});

export type GetWebSettingsUseCaseSchemaType = z.infer<typeof getWebSettingsUseCaseSchema>;
