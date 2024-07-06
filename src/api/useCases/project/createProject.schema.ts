import { z } from 'zod';

export const createProjectUseCaseSchema = z.object({
  userId: z.string(),
  name: z.string(),
  primaryLocale: z.string(),
  subdomain: z.string(),
});

export type CreateProjectUseCaseSchemaType = z.infer<typeof createProjectUseCaseSchema>;
