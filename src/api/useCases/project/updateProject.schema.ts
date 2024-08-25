import { z } from 'zod';
import { LanguageCodes } from '../../../constants/languages.js';

export const updateProjectUseCaseSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  sourceLanguage: z.nativeEnum(LanguageCodes).optional(),
});

export type UpdateProjectUseCaseSchemaType = z.infer<typeof updateProjectUseCaseSchema>;
