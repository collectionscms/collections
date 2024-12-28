import { Permission } from '@prisma/client';
import { PermissionEntity } from './permission.entity.js';

const defaultValue = {
  action: 'readPublishedPost',
  group: 'post',
  displayOrder: 1,
};

export const buildPermissionEntity = <K extends keyof Permission>(props?: {
  [key in K]: Permission[key];
}): PermissionEntity => {
  return PermissionEntity.Reconstruct<Permission, PermissionEntity>({
    ...defaultValue,
    ...props,
  });
};
