import { z } from 'zod';
import { IsoLanguageCode } from '../../../constants/languages.js';

export const translateContentUseCaseSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  sourceLanguage: z.nativeEnum(IsoLanguageCode),
  targetLanguage: z.nativeEnum(IsoLanguageCode),
});

export type TranslateContentUseCaseSchemaType = z.infer<typeof translateContentUseCaseSchema>;
