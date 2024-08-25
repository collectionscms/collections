import { z } from 'zod';
import { LanguageCodes } from '../../../constants/languages.js';

export const createProjectUseCaseSchema = z.object({
  userId: z.string(),
  name: z.string(),
  sourceLanguage: z.nativeEnum(LanguageCodes),
  subdomain: z.string(),
});

export type CreateProjectUseCaseSchemaType = z.infer<typeof createProjectUseCaseSchema>;
