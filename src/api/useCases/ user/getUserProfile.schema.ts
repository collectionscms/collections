import { z } from 'zod';

export const getUserProfileUseCaseSchema = z.object({
  projectId: z.string(),
  userId: z.string(),
});
