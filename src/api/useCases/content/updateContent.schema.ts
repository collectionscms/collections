import { z } from 'zod';

export const updateContentUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  fileId: z.string().nullable(),
  userId: z.string(),
  title: z.string().nullable(),
  body: z.string().nullable(),
  bodyJson: z.string().nullable(),
  bodyHtml: z.string().nullable(),
});

export type UpdateContentUseCaseSchemaType = z.infer<typeof updateContentUseCaseSchema>;
