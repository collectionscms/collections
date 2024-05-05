import { z } from 'zod';

export const changeStatusUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  userName: z.string(),
  status: z.string(),
});

export type ChangeStatusUseCaseSchemaType = z.infer<typeof changeStatusUseCaseSchema>;
