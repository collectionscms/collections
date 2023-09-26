import express, { Request, Response } from 'express';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { permissionsHandler } from '../middleware/permissionsHandler.js';
import { PermissionsService } from '../services/permissions.js';
import { RolesService } from '../services/roles.js';

const router = express.Router();

router.get(
  '/roles',
  permissionsHandler([{ model: 'collections_roles', action: 'read' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const rolesService = new RolesService({ schema: req.schema });
    const roles = await rolesService.readMany();

    res.json({ roles });
  })
);

router.get(
  '/roles/:id',
  permissionsHandler([{ model: 'collections_roles', action: 'read' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const rolesService = new RolesService({ schema: req.schema });
    const role = await rolesService.readOne(id);

    if (!role) throw new RecordNotFoundException('record_not_found');

    res.json({ role });
  })
);

router.post(
  '/roles',
  permissionsHandler([{ model: 'collections_roles', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const rolesService = new RolesService({ schema: req.schema });
    const roleId = await rolesService.createOne(req.body);

    res.json({
      id: roleId,
    });
  })
);

router.patch(
  '/roles/:id',
  permissionsHandler([{ model: 'collections_roles', action: 'update' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const rolesService = new RolesService({ schema: req.schema });
    await rolesService.updateOne(id, req.body);

    res.status(204).end();
  })
);

router.delete(
  '/roles/:id',
  permissionsHandler([{ model: 'collections_roles', action: 'delete' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const rolesService = new RolesService({ schema: req.schema });
    await rolesService.deleteWithPermissions(id);

    res.status(204).end();
  })
);

router.get(
  '/roles/:id/permissions',
  permissionsHandler(),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const permissionsService = new PermissionsService({ schema: req.schema });
    const permissions = await permissionsService.readMany({
      filter: { role_id: { _eq: id } },
    });

    res.json({ permissions });
  })
);

router.post(
  '/roles/:id/permissions',
  permissionsHandler([{ model: 'collections_permissions', action: 'create' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const data = {
      ...req.body,
      role_id: id,
    };

    const permissionsService = new PermissionsService({ schema: req.schema });
    const permissionId = await permissionsService.createOne(data);

    res.json({
      id: permissionId,
    });
  })
);

router.delete(
  '/roles/:id/permissions/:permissionId',
  permissionsHandler([{ model: 'collections_permissions', action: 'delete' }]),
  asyncHandler(async (req: Request, res: Response) => {
    const permissionId = Number(req.params.permissionId);

    const permissionsService = new PermissionsService({ schema: req.schema });
    await permissionsService.deleteOne(permissionId);

    res.status(204).end();
  })
);

export const roles = router;
