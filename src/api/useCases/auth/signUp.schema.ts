import { z } from 'zod';

export const signUpUseCaseSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(4)
    .max(250)
    .refine((value) => /^[a-zA-Z0-9@$!%*#?&]*$/.test(value), {
      message: 'Password type is not correct.',
    }),
  token: z.string().nullable(),
});

export type SignUpUseCaseSchemaType = z.infer<typeof signUpUseCaseSchema>;
