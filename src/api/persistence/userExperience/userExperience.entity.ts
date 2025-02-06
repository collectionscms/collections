import { UserExperience } from '@prisma/client';
import { v4 } from 'uuid';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class UserExperienceEntity extends PrismaBaseEntity<UserExperience> {
  static Construct({
    userId,
    projectId,
    experienceId,
  }: {
    userId: string;
    projectId: string;
    experienceId: string;
  }): UserExperienceEntity {
    const now = new Date();
    return new UserExperienceEntity({
      id: v4(),
      projectId,
      userId,
      experienceId,
      createdAt: now,
      updatedAt: now,
    });
  }
}
