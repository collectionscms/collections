import { z } from 'zod';

export const updateRoleUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  roleId: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  permissions: z.array(z.string()),
});

export type UpdateRoleUseCaseSchemaType = z.infer<typeof updateRoleUseCaseSchema>;
