import { z } from 'zod';

export const inviteUserUseCaseSchema = z.object({
  projectId: z.string().uuid(),
  email: z.string().email(),
  roleId: z.string().uuid(),
  invitedById: z.string().uuid(),
});

export type InviteUserUseCaseSchemaType = z.infer<typeof inviteUserUseCaseSchema>;
