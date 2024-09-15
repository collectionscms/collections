import { UserProject } from '@prisma/client';
import { InvalidPayloadException } from '../../../exceptions/invalidPayload.js';
import { UnprocessableEntityException } from '../../../exceptions/unprocessableEntity.js';
import { UserProjectRepository } from '../../persistence/userProject/userProject.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { UpdateUserUseCaseSchemaType } from './updateUser.useCase.schema.js';

export class UpdateUserUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly userProjectRepository: UserProjectRepository
  ) {}

  async execute(props: UpdateUserUseCaseSchemaType): Promise<UserProject> {
    const { id: userId, roleId } = props;

    const userProjects = await this.userProjectRepository.findMany(this.prisma);
    const ownUserProject = userProjects.find((userProject) => userProject.user.id === userId);
    if (!ownUserProject) {
      throw new InvalidPayloadException('bad_request');
    }

    const numberOfAdminRoles = userProjects.filter(
      (userProject) => userProject.role.isAdmin
    ).length;

    if (
      ownUserProject.role.isAdmin &&
      numberOfAdminRoles === 1 &&
      ownUserProject.role.id !== roleId
    ) {
      throw new UnprocessableEntityException('can_not_delete_last_admin_role');
    }

    const userProject = ownUserProject.userProject;
    userProject.updateRole(roleId);

    const result = await this.userProjectRepository.updateRole(this.prisma, userProject);
    return result.toResponse();
  }
}
