import { z } from 'zod';
import { IsoLanguageCode } from '../../../constants/languages.js';

export const getPublishedContentUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  language: z.nativeEnum(IsoLanguageCode).optional(),
  slug: z.string(),
});
export type GetPublishedContentUseCaseSchemaType = z.infer<typeof getPublishedContentUseCaseSchema>;
