import { Role } from '@prisma/client';
import { RoleEntity } from '../../persistence/role/role.entity.js';
import { RoleRepository } from '../../persistence/role/role.repository.js';
import { RolePermissionEntity } from '../../persistence/rolePermission/rolePermission.entity.js';
import { RolePermissionRepository } from '../../persistence/rolePermission/rolePermission.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { CreateRoleUseCaseSchemaType } from './createRole.schema.js';

export class CreateRoleUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly roleRepository: RoleRepository,
    private readonly rolePermissionRepository: RolePermissionRepository
  ) {}

  async execute(props: CreateRoleUseCaseSchemaType): Promise<Role> {
    const entity = RoleEntity.Construct(props);

    const permissions = props.permissions.map((permission) => {
      return RolePermissionEntity.Construct({
        roleId: entity.id,
        projectId: props.projectId,
        permissionAction: permission,
      });
    });

    const createdRole = await this.prisma.$transaction(async (tx) => {
      const result = await this.roleRepository.create(this.prisma, entity);
      await this.rolePermissionRepository.createMany(tx, permissions);

      return result;
    });

    return createdRole.toResponse();
  }
}
