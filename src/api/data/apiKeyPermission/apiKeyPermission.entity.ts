import { ApiKeyPermission } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class ApiKeyPermissionEntity extends PrismaBaseEntity<ApiKeyPermission> {
  static Construct({
    apiKeyId,
    projectId,
    permissionAction,
  }: {
    apiKeyId: string;
    projectId: string;
    permissionAction: string;
  }): ApiKeyPermissionEntity {
    return new ApiKeyPermissionEntity({
      id: v4(),
      projectId,
      apiKeyId,
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
