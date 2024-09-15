import { z } from 'zod';

export const updateRoleUseCaseSchema = z.object({
  projectId: z.string(),
  roleId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  permissions: z.array(z.string()),
});

export type UpdateRoleUseCaseSchemaType = z.infer<typeof updateRoleUseCaseSchema>;
