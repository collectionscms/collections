import { z } from 'zod';

export const updateUserUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  roleId: z.string(),
});

export type UpdateUserUseCaseSchemaType = z.infer<typeof updateUserUseCaseSchema>;
