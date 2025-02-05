import { ExperienceResource } from '@prisma/client';
import { v4 } from 'uuid';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class ExperienceResourceEntity extends PrismaBaseEntity<ExperienceResource> {
  static Construct({
    experienceId,
    url,
  }: {
    experienceId: string;
    url: string;
  }): ExperienceResourceEntity {
    const now = new Date();
    return new ExperienceResourceEntity({
      id: v4(),
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
