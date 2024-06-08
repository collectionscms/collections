import { z } from 'zod';

export const deleteUserProjectUseCaseSchema = z.object({
  projectId: z.string(),
  userId: z.string(),
});
