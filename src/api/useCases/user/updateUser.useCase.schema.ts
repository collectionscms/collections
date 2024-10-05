import { z } from 'zod';

export const updateUserUseCaseSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  roleId: z.string().uuid(),
});

export type UpdateUserUseCaseSchemaType = z.infer<typeof updateUserUseCaseSchema>;
