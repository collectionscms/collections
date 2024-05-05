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
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  update = (params: { name: string; description: string | null }) => {
    this.props.name = params.name;

    if (params.description) {
      this.props.description = params.description;
    }
  };
}
