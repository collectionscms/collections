import { NextFunction, Request, Response } from 'express';
import { ForbiddenException } from '../../exceptions/forbidden.js';
import { InvalidCredentialsException } from '../../exceptions/invalidCredentials.js';
import { PermissionsService } from '../services/permissions.js';

type PermissionsAction = 'create' | 'read' | 'update' | 'delete';

export const modelPermissionsHandler =
  (action: PermissionsAction) => async (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return next(new InvalidCredentialsException('invalid_user_credentials'));
    }

    if (!req.adminAccess) {
      const permissionsService = new PermissionsService({
        schema: req.schema,
      });

      const userPermissions = await permissionsService.readMany({
        filter: { roleId: { _eq: Number(req.roleId) } },
      });

      const hasPermission = userPermissions.some(
        (userPermission) =>
          userPermission.modelId.toString() === req.params.modelId &&
          userPermission.action === action
      );

      if (!hasPermission) {
        return next(new ForbiddenException('forbidden'));
      }
    }

    return next();
  };

export const permissionsHandler =
  (permissions: { model: string; action: PermissionsAction }[] = []) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return next(new InvalidCredentialsException('invalid_user_credentials'));
    }

    if (!req.adminAccess && permissions.length > 0) {
      const permissionsService = new PermissionsService({
        schema: req.schema,
      });

      const userPermissions = await permissionsService.readMany({
        filter: { roleId: { _eq: Number(req.roleId) } },
      });

      const hasPermission = permissions.every((permission) =>
        userPermissions.some(
          (userPermission) =>
            userPermission.model === permission.model && userPermission.action === permission.action
        )
      );

      if (!hasPermission) {
        return next(new ForbiddenException('forbidden'));
      }
    }

    return next();
  };
