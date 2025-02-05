import { z } from 'zod';
import { isValidUrl } from '../../utilities/isValidUrl.js';

export const updateProfileUseCaseSchema = z.object({
  userId: z.string().uuid(),
  name: z.string(),
  bio: z.string().nullable(),
  bioUrl: z.string().nullable().refine(isValidUrl, { message: 'Invalid URL' }),
  employer: z.string().nullable(),
  jobTitle: z.string().nullable(),
  image: z.string().nullable().optional(),
  xUrl: z.string().nullable().refine(isValidUrl, { message: 'Invalid URL' }),
  instagramUrl: z.string().nullable().refine(isValidUrl, { message: 'Invalid URL' }),
  facebookUrl: z.string().nullable().refine(isValidUrl, { message: 'Invalid URL' }),
  linkedInUrl: z.string().nullable().refine(isValidUrl, { message: 'Invalid URL' }),
  awards: z.array(z.string()),
  spokenLanguages: z.array(z.string()),
  alumni: z.array(z.object({ name: z.string(), url: z.string() })),
});

export type UpdateProfileUseCaseSchemaType = z.infer<typeof updateProfileUseCaseSchema>;
