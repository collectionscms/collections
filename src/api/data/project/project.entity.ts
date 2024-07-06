import { Project } from '@prisma/client';
import { v4 } from 'uuid';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';
import { UnexpectedException } from '../../../exceptions/unexpected.js';

export class ProjectEntity extends PrismaBaseEntity<Project> {
  static Construct({
    name,
    primaryLocale,
    subdomain,
  }: {
    name: string;
    primaryLocale: string;
    description?: string;
    subdomain: string;
  }): ProjectEntity {
    return new ProjectEntity({
      id: v4(),
      name,
      primaryLocale,
      description: null,
      subdomain,
      enabled: true,
      iconUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  private isValid() {
    if (!this.props.id) {
      throw new UnexpectedException({ message: 'id is required' });
    }
  }

  public beforeUpdateValidate(): void {
    this.isValid();
  }

  public beforeInsertValidate(): void {
    this.isValid();
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get primaryLocale(): string {
    return this.props.primaryLocale;
  }

  get subdomain(): string {
    return this.props.subdomain;
  }

  updateProject(name?: string, primaryLocale?: string) {
    if (name) {
      this.props.name = name;
    }

    if (primaryLocale) {
      this.props.primaryLocale = primaryLocale;
    }
  }
}
