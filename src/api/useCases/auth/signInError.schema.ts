import { z } from 'zod';

export const signInErrorUseCaseSchema = z.object({
  error: z.string(),
  code: z.string(),
});
