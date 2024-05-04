import { z } from 'zod';

export const createUserUseCaseSchema = z.object({
  projectId: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  apiKey: z.string().nullable(),
  roleId: z.string(),
});

export type CreateUserUseCaseSchemaType = z.infer<typeof createUserUseCaseSchema>;
