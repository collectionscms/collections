import { z } from 'zod';

export const createRoleUseCaseSchema = z.object({
  projectId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  permissions: z.array(z.string()),
});

export type CreateRoleUseCaseSchemaType = z.infer<typeof createRoleUseCaseSchema>;
