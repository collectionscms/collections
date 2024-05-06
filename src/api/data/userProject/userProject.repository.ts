import { UserProject } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { UserProjectEntity } from './userProject.entity.js';

export class UserProjectRepository {
  async findMany(
    prisma: ProjectPrismaType,
    projectId: string,
    roleId: string
  ): Promise<UserProjectEntity[]> {
    const records = await prisma.userProject.findMany({
      where: {
        projectId,
        roleId,
      },
    });
    return records.map((record) =>
      UserProjectEntity.Reconstruct<UserProject, UserProjectEntity>(record)
    );
  }

  async findOne(
    prisma: ProjectPrismaType,
    projectId: string,
    userId: string
  ): Promise<UserProjectEntity> {
    const record = await prisma.userProject.findUniqueOrThrow({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });
    return UserProjectEntity.Reconstruct<UserProject, UserProjectEntity>(record);
  }
  async delete(
    prisma: ProjectPrismaType,
    projectId: string,
    userId: string
  ): Promise<UserProjectEntity> {
    const userProject = await prisma.userProject.delete({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    });

    return UserProjectEntity.Reconstruct<UserProject, UserProjectEntity>(userProject);
  }
}
