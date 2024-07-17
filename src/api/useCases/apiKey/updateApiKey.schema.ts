import { z } from 'zod';

export const updateApiKeyUseCaseSchema = z.object({
  projectId: z.string(),
  apiKeyId: z.string(),
  name: z.string(),
  key: z.string().optional(),
});

export type UpdateApiKeyUseCaseSchemaType = z.infer<typeof updateApiKeyUseCaseSchema>;
