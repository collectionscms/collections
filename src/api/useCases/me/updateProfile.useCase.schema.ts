import { z } from 'zod';

export const updateProfileUseCaseSchema = z.object({
  userId: z.string().uuid(),
  name: z.string(),
  bio: z.string().nullable(),
  bioUrl: z.string().nullable(),
  employer: z.string().nullable(),
  jobTitle: z.string().nullable(),
  image: z.string().nullable().optional(),
  xUrl: z.string().url().nullable(),
  instagramUrl: z.string().url().nullable(),
  facebookUrl: z.string().url().nullable(),
  linkedInUrl: z.string().url().nullable(),
  awards: z.array(z.string()),
  spokenLanguages: z.array(z.string()),
  alumni: z.array(z.object({ name: z.string(), url: z.string() })),
});

export type UpdateProfileUseCaseSchemaType = z.infer<typeof updateProfileUseCaseSchema>;
