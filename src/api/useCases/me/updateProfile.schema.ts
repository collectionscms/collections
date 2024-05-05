import { z } from 'zod';

export const updateProfileUseCaseSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  name: z.string(),
  password: z.string().nullable(),
});

export type UpdateProfileUseCaseSchemaType = z.infer<typeof updateProfileUseCaseSchema>;
