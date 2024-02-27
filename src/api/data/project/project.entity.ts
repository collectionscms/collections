import { Project } from '@prisma/client';

export class ProjectEntity {
  private readonly project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  static Reconstruct(project: Project): ProjectEntity {
    return new ProjectEntity(project);
  }

  private copyProps(): Project {
    const copy = {
      ...this.project,
    };
    return Object.freeze(copy);
  }

  toPersistence(): Project {
    return this.copyProps();
  }

  toResponse() {
    return this.copyProps();
  }
}
