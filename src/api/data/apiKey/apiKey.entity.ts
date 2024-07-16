import { ApiKey } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class ApiKeyEntity extends PrismaBaseEntity<ApiKey> {
  static Construct({
    projectId,
    name,
    key,
    createdById,
  }: {
    projectId: string;
    name: string;
    key: string;
    createdById: string;
  }): ApiKeyEntity {
    return new ApiKeyEntity({
      id: v4(),
      projectId,
      name,
      key,
      createdById,
      updatedById: createdById,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get id(): string {
    return this.props.id;
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