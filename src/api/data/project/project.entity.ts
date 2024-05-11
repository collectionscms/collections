import { Project } from '@prisma/client';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class ProjectEntity extends PrismaBaseEntity<Project> {
  get subdomain(): string {
    return this.props.subdomain;
  }
}
