import { NextFunction, Request, Response } from 'express';
import { PermissionsAction } from '../../config/types.js';
import { ForbiddenException } from '../../exceptions/forbidden.js';
import { InvalidCredentialsException } from '../../exceptions/invalidCredentials.js';
import { PermissionsRepository } from '../repositories/permissions.js';

export const collectionPermissionsHandler =
  (action: PermissionsAction) => async (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return next(new InvalidCredentialsException('invalid_user_credentials'));
    }

    if (!req.adminAccess) {
      const repository = new PermissionsRepository();
      const userPermissions = await repository.read({ role_id: Number(req.roleId) });

      const hasPermission = userPermissions.some(
        (userPermission) =>
          userPermission.collection === req.params.collection && userPermission.action === action
      );

      if (!hasPermission) {
        return next(new ForbiddenException('forbidden'));
      }
    }

    return next();
  };

export const permissionsHandler =
  (permissions: { collection: string; action: PermissionsAction }[] = []) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return next(new InvalidCredentialsException('invalid_user_credentials'));
    }

    if (!req.adminAccess && permissions.length > 0) {
      const repository = new PermissionsRepository();
      const userPermissions = await repository.read({ role_id: Number(req.roleId) });

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
