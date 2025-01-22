import { Role } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class RoleEntity extends PrismaBaseEntity<Role> {
  static Construct({
    projectId,
    name,
    description,
    isAdmin,
  }: {
    projectId: string;
    name: string;
    description: string | null;
    isAdmin?: boolean;
  }): RoleEntity {
    return new RoleEntity({
      id: v4(),
      projectId,
      name,
      description,
      isAdmin: isAdmin || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  private isValid() {
    if (!this.props.id) {
      throw new UnexpectedException({ message: 'id is required' });
    }
  }

  beforeUpdateValidate(): void {
    this.isValid();
  }

  beforeInsertValidate(): void {
    this.isValid();
  }

  get id(): string {
    return this.props.id;
  }

  get isAdmin(): boolean {
    return this.props.isAdmin;
  }

  update = (params: { name: string; description: string | null }) => {
    this.props.name = params.name;

    if (params.description) {
      this.props.description = params.description;
    }
  };
}
