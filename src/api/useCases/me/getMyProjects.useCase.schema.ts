import { z } from 'zod';

export const getMyProjectsUseCaseSchema = z.object({
  userId: z.string().uuid(),
});
