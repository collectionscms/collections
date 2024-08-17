import { Project } from '@prisma/client';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { ProjectRepository } from '../../persistences/project/project.repository.js';
import { BypassPrismaType } from '../../database/prisma/client.js';

export class GetProjectFromSubdomainUseCase {
  constructor(
    private readonly prisma: BypassPrismaType,
    private readonly projectRepository: ProjectRepository
  ) {}

  async execute(subdomain: string): Promise<Project> {
    const entity = await this.projectRepository.findOneBySubdomain(this.prisma, subdomain);
    if (!entity) {
      throw new RecordNotFoundException('record_not_found');
    }

    return entity.toResponse();
  }
}
