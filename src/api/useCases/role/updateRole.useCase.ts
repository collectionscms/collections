import { Role } from '@prisma/client';
import { RoleEntity } from '../../persistences/role/role.entity.js';
import { RoleRepository } from '../../persistences/role/role.repository.js';
import { RolePermissionEntity } from '../../persistences/rolePermission/rolePermission.entity.js';
import { RolePermissionRepository } from '../../persistences/rolePermission/rolePermission.repository.js';
import { ProjectPrismaClient } from '../../database/prisma/client.js';
import { UpdateRoleUseCaseSchemaType } from './updateRole.schema.js';

export class UpdateRoleUseCase {
  constructor(
    private readonly prisma: ProjectPrismaClient,
    private readonly roleRepository: RoleRepository,
    private readonly rolePermissionRepository: RolePermissionRepository
  ) {}

  async execute(props: UpdateRoleUseCaseSchemaType): Promise<Role> {
    const role = await this.roleRepository.findOne(this.prisma, props.roleId);
    const entity = RoleEntity.Reconstruct<Role, RoleEntity>(role.toPersistence());
    entity.update({
      name: props.name,
      description: props.description,
    });

    const permissions = props.permissions.map((permission) => {
      return RolePermissionEntity.Construct({
        roleId: entity.id,
        projectId: props.projectId,
        permissionAction: permission,
      });
    });

    const updatedRole = await this.prisma.$transaction(async (tx) => {
      const result = await this.roleRepository.update(this.prisma, props.roleId, entity);
      await this.rolePermissionRepository.deleteManyByRoleId(tx, props.roleId);
      await this.rolePermissionRepository.createMany(tx, permissions);

      return result;
    });

    return updatedRole.toResponse();
  }
}
