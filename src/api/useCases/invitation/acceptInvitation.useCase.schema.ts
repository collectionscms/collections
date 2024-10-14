import { z } from 'zod';

export const acceptInvitationUseCaseSchema = z.object({
  inviteToken: z.string(),
  userId: z.string().uuid(),
});

export type AcceptInvitationUseCaseSchemaType = z.infer<typeof acceptInvitationUseCaseSchema>;
