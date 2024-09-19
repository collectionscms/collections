import { z } from 'zod';

export const updateContentUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  userId: z.string(),
  title: z.string().optional().nullable(),
  body: z.string().optional().nullable(),
  bodyJson: z.string().optional().nullable(),
  bodyHtml: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  slug: z.string().optional(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
});

export type UpdateContentUseCaseSchemaType = z.infer<typeof updateContentUseCaseSchema>;
