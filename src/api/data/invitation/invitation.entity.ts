import { Invitation } from '@prisma/client';
import dayjs from 'dayjs';
import { v4 } from 'uuid';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';
import { UnexpectedException } from '../../../exceptions/unexpected.js';

export const Status = {
  Pending: 'pending',
  Accepted: 'accepted',
} as const;

export class InvitationEntity extends PrismaBaseEntity<Invitation> {
  static Construct({
    email,
    projectId,
    roleId,
    invitedById,
  }: {
    email: string;
    projectId: string;
    roleId: string;
    invitedById: string;
  }): InvitationEntity {
    return new InvitationEntity({
      id: v4(),
      email,
      projectId,
      roleId,
      invitedById,
      token: v4(),
      status: Status.Pending,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get email(): string {
    return this.props.email;
  }

  get token(): string {
    return this.props.token;
  }

  get projectId(): string {
    return this.props.projectId;
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
