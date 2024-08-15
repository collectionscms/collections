import { Project } from '@prisma/client';
import { BypassPrismaType, ProjectPrismaType } from '../../database/prisma/client.js';
import { ProjectEntity } from './project.entity.js';

export class ProjectRepository {
  async findOneById(prisma: ProjectPrismaType, id: string): Promise<ProjectEntity> {
    const record = await prisma.project.findUniqueOrThrow({
      where: { id },
    });

    return ProjectEntity.Reconstruct<Project, ProjectEntity>(record);
  }

  async findOneBySubdomain(
    prisma: BypassPrismaType,
    subdomain: string
  ): Promise<ProjectEntity | null> {
    const record = await prisma.project.findFirst({
      where: {
        subdomain: subdomain,
      },
    });

    return record ? ProjectEntity.Reconstruct<Project, ProjectEntity>(record) : null;
  }

  async create(prisma: ProjectPrismaType, entity: ProjectEntity): Promise<ProjectEntity> {
    entity.beforeInsertValidate();

    const result = await prisma.project.create({
      data: entity.toPersistence(),
    });

    return ProjectEntity.Reconstruct<Project, ProjectEntity>(result);
  }

  async update(
    prisma: ProjectPrismaType,
    id: string,
    entity: ProjectEntity
  ): Promise<ProjectEntity> {
    entity.beforeUpdateValidate();

    const result = await prisma.project.update({
      where: { id },
      data: {
        name: entity.name,
        sourceLanguage: entity.sourceLanguage,
      },
    });

    return ProjectEntity.Reconstruct<Project, ProjectEntity>(result);
  }
}
