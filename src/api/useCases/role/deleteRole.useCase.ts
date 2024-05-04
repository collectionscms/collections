import { UnprocessableEntityException } from '../../../exceptions/unprocessableEntity.js';
import { RoleRepository } from '../../data/role/role.repository.js';
import { UserProjectRepository } from '../../data/userProject/userProject.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';

export class DeleteRoleUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly roleRepository: RoleRepository,
    private readonly userProjectRepository: UserProjectRepository
  ) {}

  async execute(projectId: string, roleId: string): Promise<void> {
    const userProjects = await this.userProjectRepository.findMany(this.prisma, projectId, roleId);
    if (userProjects.length > 0)
      throw new UnprocessableEntityException('can_not_delete_role_in_use');

    await this.roleRepository.delete(this.prisma, roleId);
  }
}
