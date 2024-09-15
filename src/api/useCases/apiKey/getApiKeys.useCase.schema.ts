import { z } from 'zod';

export const getApiKeysUseCaseSchema = z.object({
  projectId: z.string(),
});

export type GetApiKeysUseCaseSchemaType = z.infer<typeof getApiKeysUseCaseSchema>;
