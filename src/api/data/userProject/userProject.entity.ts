import { UserProject } from '@prisma/client';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class UserProjectEntity extends PrismaBaseEntity<UserProject> {
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
}
