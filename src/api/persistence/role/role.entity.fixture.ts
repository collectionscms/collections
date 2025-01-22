import { Role } from '@prisma/client';
import { v4 } from 'uuid';
import { RoleEntity } from './role.entity.js';

const defaultValue = {
  id: v4(),
  projectId: v4(),
  name: 'name',
  description: 'description',
  isAdmin: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const buildRoleEntity = <K extends keyof Role>(props?: {
  [key in K]: Role[key];
}): RoleEntity => {
  return RoleEntity.Reconstruct<Role, RoleEntity>({
    ...defaultValue,
    ...props,
  });
};
