import { RolePermission } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class RolePermissionEntity extends PrismaBaseEntity<RolePermission> {
  static Construct({
    roleId,
    projectId,
    permissionAction,
  }: {
    roleId: string;
    projectId: string;
    permissionAction: string;
  }): RolePermissionEntity {
    return new RolePermissionEntity({
      id: v4(),
      roleId,
      projectId,
      permissionAction,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get permissionAction(): string {
    return this.props.permissionAction;
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
}
