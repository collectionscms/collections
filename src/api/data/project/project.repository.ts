import { PrismaType } from '../../database/prisma/client.js';
import { ProjectEntity } from './project.entity.js';

export class ProjectRepository {
  async findOneById(prisma: PrismaType, id: string): Promise<ProjectEntity> {
    const record = await prisma.project.findUniqueOrThrow({
      where: { id },
    });

    return ProjectEntity.Reconstruct(record);
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
