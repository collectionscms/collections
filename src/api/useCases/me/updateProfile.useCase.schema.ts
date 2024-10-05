import { z } from 'zod';

export const updateProfileUseCaseSchema = z.object({
  userId: z.string().uuid(),
  name: z.string(),
});

export type UpdateProfileUseCaseSchemaType = z.infer<typeof updateProfileUseCaseSchema>;
