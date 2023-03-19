import { NextFunction, Request, Response } from 'express';
import { ForbiddenException } from '../../shared/exceptions/forbidden';
import { InvalidCredentialsException } from '../../shared/exceptions/invalidCredentials';
import { PermissionsAction } from '../../shared/types';
import PermissionsRepository from '../repositories/permissions';

export const collectionPermissionsHandler =
  (action: PermissionsAction) => async (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return next(new InvalidCredentialsException('invalid_user_credentials'));
    }

    if (!req.adminAccess) {
      const repository = new PermissionsRepository();
      const userPermissions = await repository.read({ roleId: req.roleId });

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
      return next(new InvalidCredentialsException('invalid_user_credentials'));
    }

    if (!req.adminAccess && permissions.length > 0) {
      const repository = new PermissionsRepository();
      const userPermissions = await repository.read({ roleId: req.roleId });

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
