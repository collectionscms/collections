import { z } from 'zod';

export const getApiKeysUseCaseSchema = z.object({
  projectId: z.string().uuid(),
});

export type GetApiKeysUseCaseSchemaType = z.infer<typeof getApiKeysUseCaseSchema>;
