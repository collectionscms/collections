import { z } from 'zod';

export const getApiKeyUseCaseSchema = z.object({
  projectId: z.string(),
  apiKeyId: z.string(),
});

export type GetApiKeyUseCaseSchemaType = z.infer<typeof getApiKeyUseCaseSchema>;
