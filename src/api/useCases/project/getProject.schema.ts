import { z } from 'zod';

export const getProjectUseCaseSchema = z.object({
  projectId: z.string(),
});
