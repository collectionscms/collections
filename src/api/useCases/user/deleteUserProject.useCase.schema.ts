import { z } from 'zod';

export const deleteUserProjectUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
});
