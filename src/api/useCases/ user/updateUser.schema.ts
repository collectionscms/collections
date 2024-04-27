import { z } from 'zod';

export const updateUserUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  name: z.string(),
  roleId: z.string(),
  email: z.string(),
  password: z.string().optional(),
});
