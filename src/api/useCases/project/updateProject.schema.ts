import { z } from 'zod';

export const updateProjectUseCaseSchema = z.object({
  id: z.string(),
  name: z.string(),
});
