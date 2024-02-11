import { Project } from '@prisma/client';
import { PrismaType } from '../../database/prisma/client.js';
import { ProjectEntity } from './project.entity.js';

export class ProjectRepository {
  async findProject(prisma: PrismaType, id: string): Promise<Project> {
    return prisma.project.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(prisma: PrismaType, id: string, entity: ProjectEntity): Promise<ProjectEntity> {
    const record = entity.toPersistence();
    const result = await prisma.project.update({
      where: { id },
      data: {
        name: record.name,
        description: record.description,
      },
    });

    return ProjectEntity.Reconstruct(result);
  }
}
