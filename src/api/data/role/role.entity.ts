import { Role } from '@prisma/client';
import { v4 } from 'uuid';

export class RoleEntity {
  private readonly role: Role;

  constructor(role: Role) {
    this.role = role;
  }

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

  static Reconstruct(role: Role): RoleEntity {
    return new RoleEntity(role);
  }

  private copyProps(): Role {
    const copy = {
      ...this.role,
    };
    return Object.freeze(copy);
  }

  toPersistence(): Role {
    return this.copyProps();
  }

  toResponse(): {
    id: string;
    projectId: string;
    name: string;
    description: string | null;
  } {
    return {
      id: this.role.id,
      projectId: this.role.projectId,
      name: this.role.name,
      description: this.role.description,
    };
  }
}
