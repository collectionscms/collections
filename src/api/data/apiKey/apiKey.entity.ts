import { ApiKey } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class ApiKeyEntity extends PrismaBaseEntity<ApiKey> {
  static Construct({
    projectId,
    name,
    createdById,
  }: {
    projectId: string;
    name: string;
    createdById: string;
  }): ApiKeyEntity {
    return new ApiKeyEntity({
      id: v4(),
      projectId,
      name,
      key: v4(),
      createdById,
      updatedById: createdById,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get id(): string {
    return this.props.id;
  }

  update = (params: { name: string; key?: string }) => {
    this.props.name = params.name;

    if (params.key) {
      this.props.key = params.key;
    }
  };

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
