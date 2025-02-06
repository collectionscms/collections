import { Project } from '@prisma/client';
import { v4 } from 'uuid';
import { ProjectEntity } from './project.entity.js';

export const defaultValue = {
  id: v4(),
  name: 'name',
  description: 'description',
  subdomain: 'subdomain',
  iconUrl: 'iconUrl',
  enabled: true,
  sourceLanguage: 'en-us',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const buildProjectEntity = <K extends keyof Project>(props?: {
  [key in K]: Project[key];
}): ProjectEntity => {
  return ProjectEntity.Reconstruct<Project, ProjectEntity>({
    ...defaultValue,
    ...props,
  });
};
