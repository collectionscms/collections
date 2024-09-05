import { z } from 'zod';
import { slugRegex } from '../../persistence/content/content.entity.js';

export const updateContentUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  userId: z.string(),
  title: z.string().optional().nullable(),
  body: z.string().optional().nullable(),
  bodyJson: z.string().optional().nullable(),
  bodyHtml: z.string().optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  slug: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (value === undefined) return true;
        return slugRegex.test(value);
      },
      {
        message: 'Invalid slug format',
      }
    ),
});

export type UpdateContentUseCaseSchemaType = z.infer<typeof updateContentUseCaseSchema>;
