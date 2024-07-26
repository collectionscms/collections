import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { ProjectWithRole } from '../../../types/index.js';
import { ApiKeyRepository } from '../../data/apiKey/apiKey.repository.js';
import { BypassPrismaType } from '../../database/prisma/client.js';

export class GetApiKeyProjectRolesUseCase {
  constructor(
    private readonly prisma: BypassPrismaType,
    private readonly apiKeyRepository: ApiKeyRepository
  ) {}

  async execute(key: string): Promise<ProjectWithRole> {
    const apiKeyWithProject = await this.apiKeyRepository.findOneWithProjectByKey(this.prisma, key);
    if (!apiKeyWithProject) {
      throw new RecordNotFoundException('record_not_found');
    }

    const { permissions } = await this.apiKeyRepository.findOneWithPermissions(
      this.prisma,
      apiKeyWithProject.apiKey.id
    );

    return {
      ...apiKeyWithProject.project.toResponse(),
      isAdmin: false,
      permissions: permissions.map((permission) => ({ action: permission.permissionAction })),
    };
  }
}
