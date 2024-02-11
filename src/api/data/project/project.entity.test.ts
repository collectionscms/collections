import { Project } from '@prisma/client';
import { ProjectEntity } from './project.entity';
import { v4 } from 'uuid';

describe('ProjectEntity', () => {
  let projectEntity: ProjectEntity;
  const project: Project = {
    id: v4(),
    organizationId: v4(),
    name: 'Formula one project',
    slug: 'f1-project',
    description: 'This is a formula one project',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    projectEntity = new ProjectEntity(project);
  });

  it('should create a new instance of ProjectEntity', () => {
    expect(projectEntity).toBeInstanceOf(ProjectEntity);
  });

  it('should reconstruct the project', () => {
    const reconstructedProjectEntity = ProjectEntity.Reconstruct(project);
    expect(reconstructedProjectEntity).toBeInstanceOf(ProjectEntity);
    expect(reconstructedProjectEntity.toPersistence()).toEqual(project);
  });

  it('should copy the project properties', () => {
    const copiedProject = projectEntity.toPersistence();
    expect(copiedProject).toEqual(project);
    expect(copiedProject).not.toBe(project);
  });
});
