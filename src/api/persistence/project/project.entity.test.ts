import { Project } from '@prisma/client';
import { v4 } from 'uuid';
import { ProjectEntity } from './project.entity';

describe('ProjectEntity', () => {
  const project: Project = {
    id: v4(),
    name: 'Formula one project',
    subdomain: 'f1-project',
    sourceLanguage: 'en-us',
    enabled: true,
    translationEnabled: true,
    iconUrl: null,
    description: 'This is a formula one project',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should reconstruct the project', () => {
    const reconstructedProjectEntity = ProjectEntity.Reconstruct<Project, ProjectEntity>(project);
    expect(reconstructedProjectEntity).toBeInstanceOf(ProjectEntity);
    expect(reconstructedProjectEntity.toPersistence()).toEqual(project);
  });
});
