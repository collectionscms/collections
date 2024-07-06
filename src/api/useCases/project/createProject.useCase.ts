import { Project } from '@prisma/client';
import { RecordNotUniqueException } from '../../../exceptions/database/recordNotUnique.js';
import i18n from '../../../lang/translations/config.js';
import { ProjectEntity } from '../../data/project/project.entity.js';
import { ProjectRepository } from '../../data/project/project.repository.js';
import { RoleEntity } from '../../data/role/role.entity.js';
import { RoleRepository } from '../../data/role/role.repository.js';
import { UserProjectEntity } from '../../data/userProject/userProject.entity.js';
import { UserProjectRepository } from '../../data/userProject/userProject.repository.js';
import { BypassPrismaClient } from '../../database/prisma/client.js';
import { CreateProjectUseCaseSchemaType } from './createProject.schema.js';

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
    primaryLocale,
    subdomain,
  }: CreateProjectUseCaseSchemaType): Promise<Project> {
    const t = await i18n.changeLanguage(primaryLocale);

    const project = await this.projectRepository.findOneBySubdomain(this.prisma, subdomain);
    if (project) {
      throw new RecordNotUniqueException('already_registered_project_id');
    }

    const projectEntity = ProjectEntity.Construct({
      name,
      primaryLocale,
      subdomain,
    });

    const roleEntity = RoleEntity.Construct({
      projectId: projectEntity.id,
      name: t('admin'),
      description: t('admin_description'),
    });
    roleEntity.changeToAdmin();

    const entity = UserProjectEntity.Construct({
      userId: userId,
      projectId: projectEntity.id,
      roleId: roleEntity.id,
    });

    const createdProject = await this.prisma.$transaction(async (tx) => {
      const result = await this.projectRepository.create(tx, projectEntity);
      await this.roleRepository.create(tx, roleEntity);
      await this.userProjectRepository.create(tx, entity);

      return result;
    });

    return createdProject.toResponse();
  }
}
