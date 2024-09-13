import { z } from 'zod';

export const getMyProjectUseCaseSchema = z.object({
  projectId: z.string(),
});
