import { z } from 'zod';

export const getMyProfileUseCaseSchema = z.object({
  userId: z.string().uuid(),
});
