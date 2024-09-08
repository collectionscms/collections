import { z } from 'zod';
import { IsoLanguageCode } from '../../../constants/languages.js';

export const createProjectUseCaseSchema = z.object({
  userId: z.string(),
  name: z.string(),
  sourceLanguage: z.nativeEnum(IsoLanguageCode),
  subdomain: z.string(),
});

export type CreateProjectUseCaseSchemaType = z.infer<typeof createProjectUseCaseSchema>;
