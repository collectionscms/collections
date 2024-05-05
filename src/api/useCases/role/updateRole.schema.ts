import { z } from 'zod';

export const updateRoleUseCaseSchema = z.object({
  projectId: z.string(),
  roleId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
});

export type UpdateRoleUseCaseSchemaType = z.infer<typeof updateRoleUseCaseSchema>;
