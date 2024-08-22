import { z } from 'zod';
import { LanguageCodes } from '../../../constants/languages.js';

export const getPublishedPostsUseCaseSchema = z.object({
  projectId: z.string(),
  language: z.nativeEnum(LanguageCodes).optional(),
});
export type GetPublishedPostsUseCaseSchemaType = z.infer<typeof getPublishedPostsUseCaseSchema>;
