import { Project } from '@prisma/client';
import { PrismaType, ProjectPrismaType } from '../../database/prisma/client.js';
import { ProjectEntity } from './project.entity.js';

export class ProjectRepository {
  async findOneById(prisma: ProjectPrismaType, id: string): Promise<ProjectEntity> {
    const record = await prisma.project.findUniqueOrThrow({
      where: { id },
    });

    return ProjectEntity.Reconstruct<Project, ProjectEntity>(record);
  }

  async findOneBySubdomain(prisma: PrismaType, subdomain: string): Promise<ProjectEntity> {
    const record = await prisma.project.findFirstOrThrow({
      where: {
        subdomain: subdomain,
      },
    });

    return ProjectEntity.Reconstruct<Project, ProjectEntity>(record);
  }

  async update(
    prisma: ProjectPrismaType,
    id: string,
    entity: ProjectEntity
  ): Promise<ProjectEntity> {
    const record = entity.toPersistence();
    const result = await prisma.project.update({
      where: { id },
      data: {
        name: record.name,
        defaultLocale: record.defaultLocale,
        description: record.description,
      },
    });

    return ProjectEntity.Reconstruct<Project, ProjectEntity>(result);
  }
}
