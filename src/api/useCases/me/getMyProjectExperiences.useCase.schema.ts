import { z } from 'zod';

export const getMyProjectExperiencesUseCaseSchema = z.object({
  userId: z.string().uuid(),
});

export type GetMyProjectExperiencesUseCaseSchemaType = z.infer<
  typeof getMyProjectExperiencesUseCaseSchema
>;
