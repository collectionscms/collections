import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { UnauthorizedException } from '../../../exceptions/unauthorized.js';
import { ProjectWithRole } from '../../../types/index.js';
import { BypassPrismaType } from '../../database/prisma/client.js';
import { ApiKeyRepository } from '../../persistence/apiKey/apiKey.repository.js';

export class GetApiKeyProjectRolesUseCase {
  constructor(
    private readonly prisma: BypassPrismaType,
    private readonly apiKeyRepository: ApiKeyRepository
  ) {}

  async execute(key: string): Promise<ProjectWithRole> {
    const apiKeyWithProject = await this.apiKeyRepository.findOneWithProjectByKey(this.prisma, key);
    if (!apiKeyWithProject) {
      throw new UnauthorizedException();
    }

    const apiKeyWithPermission = await this.apiKeyRepository.findOneWithPermissions(
      this.prisma,
      apiKeyWithProject.apiKey.id
    );
    if (!apiKeyWithPermission) {
      throw new RecordNotFoundException('record_not_found');
    }

    return {
      ...apiKeyWithProject.project.toResponse(),
      isAdmin: false,
      permissions: apiKeyWithPermission.permissions.map((permission) => ({
        action: permission.permissionAction,
      })),
    };
  }
}
