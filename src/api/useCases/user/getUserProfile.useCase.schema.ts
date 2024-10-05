import { z } from 'zod';

export const getUserProfileUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
});
