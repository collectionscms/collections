import { z } from 'zod';

export const deleteUserUseCaseSchema = z.object({
  projectId: z.string(),
  userId: z.string(),
});
