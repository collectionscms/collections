import { z } from 'zod';

export const getRoleUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  roleId: z.string().uuid(),
});
