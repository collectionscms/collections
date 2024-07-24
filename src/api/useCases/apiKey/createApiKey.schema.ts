import { z } from 'zod';

export const createApiKeyUseCaseSchema = z.object({
  projectId: z.string(),
  name: z.string(),
  createdById: z.string(),
  permissions: z.array(z.string()),
});

export type CreateApiKeyUseCaseSchemaType = z.infer<typeof createApiKeyUseCaseSchema>;
