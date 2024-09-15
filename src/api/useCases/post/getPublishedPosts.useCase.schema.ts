import { z } from 'zod';
import { IsoLanguageCode } from '../../../constants/languages.js';

export const getPublishedPostsUseCaseSchema = z.object({
  projectId: z.string(),
  language: z.nativeEnum(IsoLanguageCode).optional(),
});
export type GetPublishedPostsUseCaseSchemaType = z.infer<typeof getPublishedPostsUseCaseSchema>;
