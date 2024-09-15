import { z } from 'zod';

export const deleteApiKeyUseCaseSchema = z.object({
  projectId: z.string(),
  apiKeyId: z.string(),
});

export type DeleteApiKeyUseCaseSchemaType = z.infer<typeof deleteApiKeyUseCaseSchema>;
