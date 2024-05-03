import { RecordNotUniqueException } from '../../../exceptions/database/recordNotUnique.js';
import { UserProfile } from '../../../types/index.js';
import {
  PrismaType,
  ProjectPrismaClient,
  ProjectPrismaType,
} from '../../database/prisma/client.js';
import { UserEntity } from './user.entity.js';

export class UserRepository {
  async findUserById(prisma: ProjectPrismaType, id: string): Promise<UserEntity> {
    const project = await prisma.project.findFirstOrThrow({
      where: {
        userProjects: {
          some: {
            userId: id,
          },
        },
      },
      include: {
        userProjects: {
          select: {
            user: true,
          },
        },
      },
    });

    return UserEntity.Reconstruct(project.userProjects[0].user);
  }

  async findUserProfile(prisma: ProjectPrismaType, id: string): Promise<UserProfile> {
    const project = await prisma.project.findFirstOrThrow({
      include: {
        userProjects: {
          where: {
            userId: id,
          },
          select: {
            user: true,
            role: true,
          },
        },
      },
    });

    const { user, role } = project.userProjects[0];

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      role: role,
    };
  }

  async findUserProfiles(prisma: ProjectPrismaType): Promise<UserProfile[]> {
    const project = await prisma.project.findFirstOrThrow({
      include: {
        userProjects: {
          select: {
            user: true,
            role: true,
          },
        },
      },
    });

    return project.userProjects.map((userProject) => {
      return {
        id: userProject.user.id,
        name: userProject.user.name,
        email: userProject.user.email,
        isActive: userProject.user.isActive,
        role: userProject.role,
      };
    });
  }

  async create(
    prisma: ProjectPrismaType,
    entity: UserEntity,
    projectId: string,
    roleId: string
  ): Promise<UserEntity> {
    const user = await prisma.user.create({
      data: {
        ...entity.toPersistence(),
        userProjects: {
          create: {
            role: {
              connect: {
                id: roleId,
              },
            },
            project: {
              connect: {
                id: projectId,
              },
            },
          },
        },
      },
    });

    return UserEntity.Reconstruct(user);
  }

  async update(prisma: ProjectPrismaType, userId: string, user: UserEntity): Promise<UserEntity> {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: user.toPersistence(),
    });

    return UserEntity.Reconstruct(updatedUser);
  }

  async updateWithRole(
    prisma: ProjectPrismaClient,
    userId: string,
    projectId: string,
    roleId: string,
    params: {
      password: string;
      email: string;
      name: string;
    }
  ): Promise<UserEntity> {
    const user = await this.findUserById(prisma, userId);
    user.update(params);

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: user.password,
        email: user.email,
        name: user.name,
        userProjects: {
          update: {
            where: {
              userId_projectId: {
                userId,
                projectId,
              },
            },
            data: {
              roleId,
            },
          },
        },
      },
    });

    return UserEntity.Reconstruct(updatedUser);
  }

  async delete(prisma: ProjectPrismaType, id: string): Promise<void> {
    const user = await this.findUserById(prisma, id);

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });
  }

  async checkUniqueEmail(prisma: PrismaType, id: string, email: string) {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (user && user.id !== id) {
      throw new RecordNotUniqueException('already_registered_email');
    }
  }
}
