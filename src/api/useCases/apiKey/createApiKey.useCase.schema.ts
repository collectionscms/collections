import { z } from 'zod';

export const createApiKeyUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  name: z.string(),
  createdById: z.string().uuid(),
  permissions: z.array(z.string()),
});

export type CreateApiKeyUseCaseSchemaType = z.infer<typeof createApiKeyUseCaseSchema>;
