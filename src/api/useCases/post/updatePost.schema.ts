import { z } from 'zod';

const slugRegex = /^[a-zA-Z0-9-_]+$/;

export const updatePostUseCaseSchema = z.object({
  projectId: z.string(),
  postId: z.string(),
  slug: z.string().refine((value) => slugRegex.test(value), {
    message: 'Invalid slug format',
  }),
});

export type UpdatePostUseCaseSchemaType = z.infer<typeof updatePostUseCaseSchema>;
