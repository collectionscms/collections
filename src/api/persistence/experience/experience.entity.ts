import { Experience } from '@prisma/client';
import { v4 } from 'uuid';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class ExperienceEntity extends PrismaBaseEntity<Experience> {
  static Construct({
    projectId,
    name,
    url,
  }: {
    projectId: string;
    name: string;
    url: string | null;
  }): ExperienceEntity {
    const now = new Date();
    return new ExperienceEntity({
      id: v4(),
      projectId,
      name,
      url,
      createdAt: now,
      updatedAt: now,
    });
  }
}
