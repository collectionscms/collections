import { z } from 'zod';

export const getPermissionsUseCaseSchema = z.object({
  projectId: z.string(),
  roleId: z.string(),
});
