import { z } from 'zod';

export const getWebSettingUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  id: z.string().uuid(),
});

export type GetWebSettingUseCaseSchemaType = z.infer<typeof getWebSettingUseCaseSchema>;
