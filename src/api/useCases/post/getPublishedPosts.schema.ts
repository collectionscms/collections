import { z } from 'zod';
import { languages } from '../../../constants/languages.js';

const languageCodes = languages.map((lang) => lang.code);

export const getPublishedPostsUseCaseSchema = z.object({
  projectId: z.string(),
  language: z
    .string()
    .optional()
    .refine((val) => !val || languageCodes.includes(val), {
      message: 'Invalid language code',
    }),
});

export type GetPublishedPostsUseCaseSchemaType = z.infer<typeof getPublishedPostsUseCaseSchema>;
