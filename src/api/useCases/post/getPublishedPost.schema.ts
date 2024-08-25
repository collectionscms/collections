import { z } from 'zod';
import { LanguageCodes } from '../../../constants/languages.js';

export const getPublishedPostUseCaseSchema = z.object({
  projectId: z.string(),
  language: z.nativeEnum(LanguageCodes).optional(),
  key: z.string(),
});
export type GetPublishedPostUseCaseSchemaType = z.infer<typeof getPublishedPostUseCaseSchema>;
