import { z } from 'zod';
import { IsoLanguageCode } from '../../../constants/languages.js';

export const updateProjectUseCaseSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  sourceLanguage: z.nativeEnum(IsoLanguageCode).optional(),
});

export type UpdateProjectUseCaseSchemaType = z.infer<typeof updateProjectUseCaseSchema>;
