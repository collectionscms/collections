import { z } from 'zod';

export const updateContentUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  userId: z.string(),
  title: z.string().nullable(),
  body: z.string().nullable(),
  bodyJson: z.string().nullable(),
  bodyHtml: z.string().nullable(),
  coverUrl: z.string().nullable(),
});

export type UpdateContentUseCaseSchemaType = z.infer<typeof updateContentUseCaseSchema>;
