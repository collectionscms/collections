import { ExperienceResource } from '@prisma/client';
import { v4 } from 'uuid';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class ExperienceResourceEntity extends PrismaBaseEntity<ExperienceResource> {
  static Construct({
    projectId,
    experienceId,
    url,
  }: {
    projectId: string;
    experienceId: string;
    url: string;
  }): ExperienceResourceEntity {
    const now = new Date();
    return new ExperienceResourceEntity({
      id: v4(),
      projectId,
      experienceId,
      url,
      createdAt: now,
      updatedAt: now,
    });
  }

  get url(): string {
    return this.props.url;
  }
}
