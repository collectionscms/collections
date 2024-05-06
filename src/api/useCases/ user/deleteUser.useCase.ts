import { UnprocessableEntityException } from '../../../exceptions/unprocessableEntity.js';
import { UserProjectRepository } from '../../data/userProject/userProject.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';

export class DeleteUserUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly userProjectRepository: UserProjectRepository
  ) {}

  async execute(projectId: string, userId: string): Promise<void> {
    const userProject = await this.userProjectRepository.findOne(this.prisma, projectId, userId);
    if (userProject.isAdmin) {
      throw new UnprocessableEntityException('unable_delete_user');
    }

    await this.userProjectRepository.delete(this.prisma, projectId, userId);
  }
}
