import { z } from 'zod';

export const deleteRoleUseCaseSchema = z.object({
  projectId: z.string(),
  roleId: z.string(),
});
