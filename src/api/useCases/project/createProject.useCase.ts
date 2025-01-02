import { Project } from '@prisma/client';
import { env } from '../../../env.js';
import { RecordNotUniqueException } from '../../../exceptions/database/recordNotUnique.js';
import i18n from '../../../lang/translations/config.js';
import { BypassPrismaClient } from '../../database/prisma/client.js';
import { ProjectEntity } from '../../persistence/project/project.entity.js';
import { ProjectRepository } from '../../persistence/project/project.repository.js';
import { RoleEntity } from '../../persistence/role/role.entity.js';
import { RoleRepository } from '../../persistence/role/role.repository.js';
import { UserProjectEntity } from '../../persistence/userProject/userProject.entity.js';
import { UserProjectRepository } from '../../persistence/userProject/userProject.repository.js';
import { CreateProjectUseCaseSchemaType } from './createProject.useCase.schema.js';

export class CreateProjectUseCase {
  constructor(
    private readonly prisma: BypassPrismaClient,
    private readonly projectRepository: ProjectRepository,
    private readonly userProjectRepository: UserProjectRepository,
    private readonly roleRepository: RoleRepository
  ) {}

  async execute({
    userId,
    name,
    sourceLanguage,
    subdomain,
  }: CreateProjectUseCaseSchemaType): Promise<Project> {
    const t = await i18n.changeLanguage(sourceLanguage);

    const isReservedSubdomain = env.RESERVED_SUBDOMAINS.split(',').includes(subdomain);
    const project = await this.projectRepository.findOneBySubdomain(this.prisma, subdomain);
    if (isReservedSubdomain || project) {
      throw new RecordNotUniqueException('already_registered_project_id');
    }

    const projectEntity = ProjectEntity.Construct({
      name,
      sourceLanguage,
      subdomain,
    });

    const roleEntity = RoleEntity.Construct({
      projectId: projectEntity.id,
      name: t('seed.role.admin'),
      description: t('seed.role.admin_description'),
      isAdmin: true,
    });

    const userProjectEntity = UserProjectEntity.Construct({
      userId: userId,
      projectId: projectEntity.id,
      roleId: roleEntity.id,
    });

    const createdProject = await this.prisma.$transaction(async (tx) => {
      const result = await this.projectRepository.create(tx, projectEntity);
      await this.roleRepository.create(tx, roleEntity);
      await this.userProjectRepository.create(tx, userProjectEntity);

      return result;
    });

    return createdProject.toResponse();
  }
}
