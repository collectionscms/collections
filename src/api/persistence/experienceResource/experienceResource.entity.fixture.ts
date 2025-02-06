import { ExperienceResource } from '@prisma/client';
import { v4 } from 'uuid';
import { ExperienceResourceEntity } from './experienceResource.entity.js';

export const defaultValue = {
  id: v4(),
  projectId: v4(),
  experienceId: v4(),
  url: 'https://example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const buildExperienceResourceEntity = <K extends keyof ExperienceResource>(props?: {
  [key in K]: ExperienceResource[key];
}): ExperienceResourceEntity => {
  return ExperienceResourceEntity.Reconstruct<ExperienceResource, ExperienceResourceEntity>({
    ...defaultValue,
    ...props,
  });
};
