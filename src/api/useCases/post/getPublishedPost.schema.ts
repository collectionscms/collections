import { z } from 'zod';
import { IsoLanguageCode } from '../../../constants/languages.js';

export const getPublishedPostUseCaseSchema = z.object({
  projectId: z.string(),
  language: z.nativeEnum(IsoLanguageCode).optional(),
  key: z.string(),
});
export type GetPublishedPostUseCaseSchemaType = z.infer<typeof getPublishedPostUseCaseSchema>;
