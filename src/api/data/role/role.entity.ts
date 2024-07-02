import { Role } from '@prisma/client';
import { v4 } from 'uuid';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class RoleEntity extends PrismaBaseEntity<Role> {
  static Construct({
    projectId,
    name,
    description,
  }: {
    projectId: string;
    name: string;
    description: string | null;
  }): RoleEntity {
    return new RoleEntity({
      id: v4(),
      projectId,
      name,
      description,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get isAdmin(): boolean {
    return this.props.isAdmin;
  }

  changeToAdmin = () => {
    this.props.isAdmin = true;
  };

  update = (params: { name: string; description: string | null }) => {
    this.props.name = params.name;

    if (params.description) {
      this.props.description = params.description;
    }
  };
}
