import { UserProject } from '@prisma/client';
import { UserProjectRepository } from '../../data/userProject/userProject.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { UpdateUserUseCaseSchemaType } from './updateUser.schema.js';

export class UpdateUserUseCase {
  constructor(
    private readonly projectPrisma: ProjectPrismaClient,
    private readonly userProjectRepository: UserProjectRepository
  ) {}

  async execute(props: UpdateUserUseCaseSchemaType): Promise<UserProject> {
    const { id: userId, projectId, roleId } = props;

    const userProject = await this.userProjectRepository.findOne(
      this.projectPrisma,
      projectId,
      userId
    );
    userProject.updateRole(roleId);

    const result = await this.userProjectRepository.updateRole(
      this.projectPrisma,
      userId,
      projectId,
      userProject
    );
    return result.toResponse();
  }
}
