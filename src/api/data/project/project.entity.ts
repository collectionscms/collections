import { Project } from '@prisma/client';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class ProjectEntity extends PrismaBaseEntity<Project> {
  get subdomain(): string {
    return this.props.subdomain;
  }

  updateProject(name?: string, defaultLocale?: string) {
    if (name) {
      this.props.name = name;
    }

    if (defaultLocale) {
      this.props.defaultLocale = defaultLocale;
    }
  }
}
