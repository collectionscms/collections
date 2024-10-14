import { z } from 'zod';

export const deleteRoleUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  roleId: z.string().uuid(),
});
