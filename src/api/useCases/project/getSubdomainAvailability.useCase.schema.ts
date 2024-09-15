import { z } from 'zod';

export const getSubdomainAvailabilityUseCaseSchema = z.object({
  subdomain: z.string(),
});

export type GetSubdomainAvailabilityUseCaseSchemaType = z.infer<
  typeof getSubdomainAvailabilityUseCaseSchema
>;
