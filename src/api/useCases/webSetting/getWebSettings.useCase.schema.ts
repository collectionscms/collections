import { z } from 'zod';

export const getWebSettingsUseCaseSchema = z.object({
  projectId: z.string(),
});

export type GetWebSettingsUseCaseSchemaType = z.infer<typeof getWebSettingsUseCaseSchema>;
