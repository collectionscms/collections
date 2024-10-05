import { z } from 'zod';

export const deleteApiKeyUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  apiKeyId: z.string().uuid(),
});

export type DeleteApiKeyUseCaseSchemaType = z.infer<typeof deleteApiKeyUseCaseSchema>;
