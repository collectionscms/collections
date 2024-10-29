import { z } from 'zod';

export const getTagsUseCaseSchema = z.object({
  projectId: z.string().uuid(),
});

export type GetTagsUseCaseSchemaType = z.infer<typeof getTagsUseCaseSchema>;
