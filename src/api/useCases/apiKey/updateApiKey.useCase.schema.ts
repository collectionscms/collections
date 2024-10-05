import { z } from 'zod';

export const updateApiKeyUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  apiKeyId: z.string().uuid(),
  name: z.string(),
  key: z.string().optional(),
  permissions: z.array(z.string()),
});

export type UpdateApiKeyUseCaseSchemaType = z.infer<typeof updateApiKeyUseCaseSchema>;
