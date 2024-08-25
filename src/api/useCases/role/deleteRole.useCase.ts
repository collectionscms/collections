import { UnprocessableEntityException } from '../../../exceptions/unprocessableEntity.js';
import { RoleRepository } from '../../persistence/role/role.repository.js';
import { UserProjectRepository } from '../../persistence/userProject/userProject.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';

export class DeleteRoleUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly roleRepository: RoleRepository,
    private readonly userProjectRepository: UserProjectRepository
  ) {}

  async execute(roleId: string): Promise<void> {
    const userProjects = await this.userProjectRepository.findMany(this.prisma);
    if (userProjects.some((userProject) => userProject.role.id === roleId)) {
      throw new UnprocessableEntityException('can_not_delete_role_in_use');
    }

    await this.roleRepository.delete(this.prisma, roleId);
  }
}
