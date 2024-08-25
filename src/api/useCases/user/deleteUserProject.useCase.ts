import { InvalidPayloadException } from '../../../exceptions/invalidPayload.js';
import { UnprocessableEntityException } from '../../../exceptions/unprocessableEntity.js';
import { UserProjectRepository } from '../../persistence/userProject/userProject.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';

export class DeleteUserProjectUserUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly userProjectRepository: UserProjectRepository
  ) {}

  async execute(userId: string): Promise<void> {
    const userProjects = await this.userProjectRepository.findMany(this.prisma);
    const ownUserProject = userProjects.find((userProject) => userProject.user.id === userId);
    if (!ownUserProject) {
      throw new InvalidPayloadException('bad_request');
    }

    const numberOfAdminRoles = userProjects.filter(
      (userProject) => userProject.role.isAdmin
    ).length;

    if (ownUserProject.role.isAdmin && numberOfAdminRoles === 1) {
      throw new UnprocessableEntityException('unable_delete_user');
    }

    await this.userProjectRepository.delete(
      this.prisma,
      ownUserProject.userProject.projectId,
      ownUserProject.user.id
    );
  }
}
