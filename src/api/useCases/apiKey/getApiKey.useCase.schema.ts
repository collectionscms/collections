import { z } from 'zod';

export const getApiKeyUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  apiKeyId: z.string().uuid(),
});

export type GetApiKeyUseCaseSchemaType = z.infer<typeof getApiKeyUseCaseSchema>;
