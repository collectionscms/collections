import { NextFunction, Request, Response } from 'express';
import { PermissionsAction } from '../../config/types.js';
import { ForbiddenException } from '../../exceptions/forbidden.js';
import { InvalidCredentialsException } from '../../exceptions/invalidCredentials.js';
import { PermissionsService } from '../services/permissions.js';

export const collectionPermissionsHandler =
  (action: PermissionsAction) => async (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return next(new InvalidCredentialsException('invalid_user_credentials'));
    }

    if (!req.adminAccess) {
      const permissionsService = new PermissionsService({
        schema: req.schema,
      });

      const userPermissions = await permissionsService.readMany({
        filter: { role_id: { _eq: Number(req.roleId) } },
      });

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
      const permissionsService = new PermissionsService({
        schema: req.schema,
      });

      const userPermissions = await permissionsService.readMany({
        filter: { role_id: { _eq: Number(req.roleId) } },
      });

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
