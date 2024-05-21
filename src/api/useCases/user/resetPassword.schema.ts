import { z } from 'zod';

export const resetPasswordUseCaseSchema = z.object({
  token: z.string(),
  password: z
    .string()
    .min(4)
    .max(250)
    .refine((value) => /^[a-zA-Z0-9@$!%*#?&]*$/.test(value), {
      message: 'Password type is not correct.',
    }),
});

export type ResetPasswordUseCaseSchemaType = z.infer<typeof resetPasswordUseCaseSchema>;
