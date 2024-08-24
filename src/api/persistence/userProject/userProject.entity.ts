import { UserProject } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class UserProjectEntity extends PrismaBaseEntity<UserProject> {
  static Construct({
    userId,
    projectId,
    roleId,
  }: {
    userId: string;
    projectId: string;
    roleId: string;
  }): UserProjectEntity {
    const now = new Date();
    return new UserProjectEntity({
      id: v4(),
      userId,
      projectId,
      roleId,
      createdAt: now,
      updatedAt: now,
    });
  }

  get userId(): string {
    return this.props.userId;
  }

  get projectId(): string {
    return this.props.projectId;
  }

  get roleId(): string {
    return this.props.roleId;
  }

  updateRole(roleId: string) {
    this.props.roleId = roleId;
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
