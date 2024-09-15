import { z } from 'zod';

export const getRoleUseCaseSchema = z.object({
  projectId: z.string(),
  roleId: z.string(),
});
