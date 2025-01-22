import { z } from 'zod';
import { IsoLanguageCode } from '../../../constants/languages.js';

export const getPublishedContentUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  language: z.nativeEnum(IsoLanguageCode).optional(),
  identifier: z.string(),
  draftKey: z.string().optional(),
});
export type GetPublishedContentUseCaseSchemaType = z.infer<typeof getPublishedContentUseCaseSchema>;
