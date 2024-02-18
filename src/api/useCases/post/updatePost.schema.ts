import { z } from 'zod';

export const updatePostUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  status: z.string(),
});
