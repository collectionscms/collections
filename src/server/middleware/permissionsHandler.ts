import { NextFunction, Request, Response } from 'express';
import { ForbiddenException } from '../../shared/exceptions/forbidden';
import { InvalidCredentialsException } from '../../shared/exceptions/invalidCredentials';
import { Permission, PermissionsAction } from '../../shared/types';
import { getDatabase } from '../database/connection';

export const collectionPermissionsHandler =
  (action: PermissionsAction) => async (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId) {
      next(new InvalidCredentialsException('invalid_user_credentials'));
    }

    if (!req.adminAccess) {
      const database = await getDatabase();
      const userPermissions = await database<Permission>('superfast_permissions').where(
        'superfast_role_id',
        req.roleId
      );

      const hasPermission = userPermissions.some(
        (userPermission) =>
          userPermission.collection === req.params.slug && userPermission.action === action
      );

      if (!hasPermission) {
        return next(new ForbiddenException('forbidden'));
      }
    }

    return next();
  };

const permissionsHandler =
  (permissions: { collection: string; action: PermissionsAction }[] = []) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId) {
      next(new InvalidCredentialsException('invalid_user_credentials'));
    }

    if (!req.adminAccess && permissions.length > 0) {
      const database = await getDatabase();
      const userPermissions = await database<Permission>('superfast_permissions').where(
        'superfast_role_id',
        req.roleId
      );

      const hasPermission = permissions.every((permission) =>
        userPermissions.some(
          (userPermission) =>
            userPermission.collection === permission.collection &&
            userPermission.action === permission.action
        )
      );

      if (!hasPermission) {
        return next(new ForbiddenException('forbidden'));
      }
    }

    return next();
  };

export default permissionsHandler;
