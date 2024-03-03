import { z } from 'zod';

export const changeStatusUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  userName: z.string(),
  status: z.string(),
});
