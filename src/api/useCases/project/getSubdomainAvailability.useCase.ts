import { env } from '../../../env.js';
import { BypassPrismaClient } from '../../database/prisma/client.js';
import { ProjectRepository } from '../../persistence/project/project.repository.js';
import { GetSubdomainAvailabilityUseCaseSchemaType } from './getSubdomainAvailability.useCase.schema.js';

type GetSubdomainAvailabilityUseCaseResponse = {
  available: boolean;
};

export class GetSubdomainAvailabilityUseCase {
  constructor(
    private readonly prisma: BypassPrismaClient,
    private readonly projectRepository: ProjectRepository
  ) {}

  async execute(
    props: GetSubdomainAvailabilityUseCaseSchemaType
  ): Promise<GetSubdomainAvailabilityUseCaseResponse> {
    const isReservedSubdomain = env.RESERVED_SUBDOMAINS.split(',').includes(props.subdomain);
    if (isReservedSubdomain) {
      return {
        available: false,
      };
    }

    const record = await this.projectRepository.findOneBySubdomain(this.prisma, props.subdomain);
    return record
      ? {
          available: false,
        }
      : {
          available: true,
        };
  }
}
