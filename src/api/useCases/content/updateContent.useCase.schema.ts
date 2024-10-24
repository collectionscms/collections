import { z } from 'zod';

export const updateContentUseCaseSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string().optional().nullable(),
  subtitle: z.string().optional().nullable(),
  body: z.string().optional().nullable(),
  bodyJson: z.string().optional().nullable(),
  bodyHtml: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  slug: z.string().regex(/^[a-z0-9-]+$/, `Alphanumeric characters and symbols '-'`),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
});

export type UpdateContentUseCaseSchemaType = z.infer<typeof updateContentUseCaseSchema>;
