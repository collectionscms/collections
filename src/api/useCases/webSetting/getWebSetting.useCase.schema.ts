import { z } from 'zod';

export const getWebSettingUseCaseSchema = z.object({
  projectId: z.string(),
  id: z.string(),
});

export type GetWebSettingUseCaseSchemaType = z.infer<typeof getWebSettingUseCaseSchema>;
