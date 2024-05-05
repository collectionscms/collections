import { z } from 'zod';

export const createRoleUseCaseSchema = z.object({
  projectId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
});

export type CreateRoleUseCaseSchemaType = z.infer<typeof createRoleUseCaseSchema>;
