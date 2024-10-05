import { z } from 'zod';
import { IsoLanguageCode } from '../../../constants/languages.js';

export const getPublishedPostUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  language: z.nativeEnum(IsoLanguageCode).optional(),
  id: z.string().uuid(),
});
export type GetPublishedPostUseCaseSchemaType = z.infer<typeof getPublishedPostUseCaseSchema>;
