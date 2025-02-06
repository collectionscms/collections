import { Experience } from '@prisma/client';
import { ExperienceEntity } from './experience.entity.js';
import { v4 } from 'uuid';

export const defaultValue = {
  id: v4(),
  projectId: v4(),
  name: 'React',
  url: 'https://react.dev/',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const buildExperienceEntity = <K extends keyof Experience>(props?: {
  [key in K]: Experience[key];
}): ExperienceEntity => {
  return ExperienceEntity.Reconstruct<Experience, ExperienceEntity>({
    ...defaultValue,
    ...props,
  });
};
