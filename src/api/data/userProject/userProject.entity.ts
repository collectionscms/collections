import { UserProject } from '@prisma/client';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class UserProjectEntity extends PrismaBaseEntity<UserProject> {
  get isAdmin(): boolean {
    return this.props.isAdmin;
  }

  get roleId(): string {
    return this.props.roleId;
  }

  updateRole(roleId: string) {
    this.props.roleId = roleId;
  }
}
