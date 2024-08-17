import { UnauthorizedException } from '../../../exceptions/unauthorized.js';
import { ProjectWithRole } from '../../../types/index.js';
import { ApiKeyRepository } from '../../persistences/apiKey/apiKey.repository.js';
import { BypassPrismaType } from '../../database/prisma/client.js';

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
