import { z } from 'zod';
import { AuthProvider } from '../../persistence/user/user.entity.js';

export const oAuthSingInUseCaseSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  provider: z.nativeEnum(AuthProvider),
  providerId: z.string().uuid(),
});

export type OAuthSingInUseCaseSchemaType = z.infer<typeof oAuthSingInUseCaseSchema>;
