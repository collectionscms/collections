import { Experience } from '@prisma/client';
import { v4 } from 'uuid';
import { ExperienceWithResourceUrl } from '../../../types/index.js';
import { ExperienceResourceEntity } from '../experienceResource/experienceResource.entity.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class ExperienceEntity extends PrismaBaseEntity<Experience> {
  static Construct({
    projectId,
    name,
    url,
    resourceUrls,
  }: {
    projectId: string;
    name: string;
    url: string | null;
    resourceUrls: string[];
  }): { experience: ExperienceEntity; experienceResources: ExperienceResourceEntity[] } {
    const now = new Date();
    const experienceEntity = new ExperienceEntity({
      id: v4(),
      projectId,
      name,
      url,
      createdAt: now,
      updatedAt: now,
    });

    const experienceResourceEntities = resourceUrls.map((resourceUrl) =>
      ExperienceResourceEntity.Construct({
        projectId,
        experienceId: experienceEntity.id,
        url: resourceUrl,
      })
    );

    return { experience: experienceEntity, experienceResources: experienceResourceEntities };
  }

  get id(): string {
    return this.props.id;
  }

  get projectId(): string {
    return this.props.projectId;
  }

  toWithResourcesResponse(
    experienceResources: ExperienceResourceEntity[]
  ): ExperienceWithResourceUrl {
    return {
      ...this.toResponse(),
      resourceUrls: experienceResources.map((resource) => resource.url),
    };
  }
}
