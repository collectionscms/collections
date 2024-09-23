import { Invitation } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

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

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get token(): string {
    return this.props.token;
  }

  get roleId(): string {
    return this.props.roleId;
  }

  get projectId(): string {
    return this.props.projectId;
  }

  get status(): string {
    return this.props.status;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  acceptInvitation(): void {
    this.props.status = Status.Accepted;
  }

  isAccepted(): boolean {
    return this.props.status === Status.Accepted;
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
