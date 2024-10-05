import { z } from 'zod';

export const getPermissionsUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  roleId: z.string().uuid(),
});
