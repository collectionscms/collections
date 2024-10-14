import express, { Request, Response } from 'express';
import { InvalidPayloadException } from '../../exceptions/invalidPayload.js';
import { projectPrisma } from '../database/prisma/client.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { authenticatedUser } from '../middlewares/auth.js';
import { validateAccess } from '../middlewares/validateAccess.js';
import { RoleRepository } from '../persistence/role/role.repository.js';
import { RolePermissionRepository } from '../persistence/rolePermission/rolePermission.repository.js';
import { UserProjectRepository } from '../persistence/userProject/userProject.repository.js';
import { CreateRoleUseCase } from '../useCases/role/createRole.useCase.js';
import { createRoleUseCaseSchema } from '../useCases/role/createRole.useCase.schema.js';
import { DeleteRoleUseCase } from '../useCases/role/deleteRole.useCase.js';
import { deleteRoleUseCaseSchema } from '../useCases/role/deleteRole.useCase.schema.js';
import { GetPermissionsUseCase } from '../useCases/role/getPermissions.useCase.js';
import { getPermissionsUseCaseSchema } from '../useCases/role/getPermissions.useCase.schema.js';
import { GetRoleUseCase } from '../useCases/role/getRole.useCase.js';
import { getRoleUseCaseSchema } from '../useCases/role/getRole.useCase.schema.js';
import { GetRolesUseCase } from '../useCases/role/getRoles.useCase.js';
import { getRolesUseCaseSchema } from '../useCases/role/getRoles.useCase.schema.js';
import { UpdateRoleUseCase } from '../useCases/role/updateRole.useCase.js';
import { updateRoleUseCaseSchema } from '../useCases/role/updateRole.useCase.schema.js';

const router = express.Router();

router.get(
  '/roles',
  authenticatedUser,
  validateAccess(['readRole', 'inviteUser', 'readUser']), // Allow access also during invitations and user editing
  asyncHandler(async (_req: Request, res: Response) => {
    const validated = getRolesUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetRolesUseCase(
      projectPrisma(validated.data.projectId),
      new RoleRepository()
    );
    const roles = await useCase.execute();

    res.json({ roles });
  })
);

router.get(
  '/roles/:id',
  authenticatedUser,
  validateAccess(['readRole']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getRoleUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      roleId: req.params.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetRoleUseCase(
      projectPrisma(validated.data.projectId),
      new RoleRepository()
    );
    const role = await useCase.execute(validated.data.roleId);

    res.json({ role });
  })
);

router.post(
  '/roles',
  authenticatedUser,
  validateAccess(['createRole']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = createRoleUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      name: req.body.name,
      description: req.body.description,
      permissions: req.body.permissions,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new CreateRoleUseCase(
      projectPrisma(validated.data.projectId),
      new RoleRepository(),
      new RolePermissionRepository()
    );
    const role = await useCase.execute(validated.data);

    res.json({ role });
  })
);

router.patch(
  '/roles/:id',
  authenticatedUser,
  validateAccess(['updateRole']),
  asyncHandler(async (req: Request, res: Response) => {
    const validated = updateRoleUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      roleId: req.params.id,
      name: req.body.name,
      description: req.body.description,
      permissions: req.body.permissions,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new UpdateRoleUseCase(
      projectPrisma(validated.data.projectId),
      new RoleRepository(),
      new RolePermissionRepository()
    );
    await useCase.execute(validated.data);

    res.status(204).end();
  })
);

router.delete(
  '/roles/:id',
  authenticatedUser,
  validateAccess(['deleteRole']),
  asyncHandler(async (req: Request, res: Response) => {
    const validate = deleteRoleUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      roleId: req.params.id,
    });
    if (!validate.success) throw new InvalidPayloadException('bad_request', validate.error);

    const useCase = new DeleteRoleUseCase(
      projectPrisma(validate.data.projectId),
      new RoleRepository(),
      new UserProjectRepository()
    );
    await useCase.execute(validate.data.roleId);

    res.status(204).end();
  })
);

router.get(
  '/roles/:id/permissions',
  authenticatedUser,
  asyncHandler(async (req: Request, res: Response) => {
    const validated = getPermissionsUseCaseSchema.safeParse({
      projectId: res.projectRole?.id,
      roleId: req.params.id,
    });
    if (!validated.success) throw new InvalidPayloadException('bad_request', validated.error);

    const useCase = new GetPermissionsUseCase(
      projectPrisma(validated.data.projectId),
      new RoleRepository()
    );
    const permissions = await useCase.execute(validated.data.roleId);

    res.json({ permissions });
  })
);

export const role = router;
