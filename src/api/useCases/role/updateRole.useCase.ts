import { Role } from '@prisma/client';
import { RoleEntity } from '../../data/role/role.entity.js';
import { RoleRepository } from '../../data/role/role.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { UpdateRoleUseCaseSchemaType } from './updateRole.schema.js';

export class UpdateRoleUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly roleRepository: RoleRepository
  ) {}

  async execute(props: UpdateRoleUseCaseSchemaType): Promise<Role> {
    console.log('roleとる', props.roleId);

    const role = await this.roleRepository.findOne(this.prisma, props.roleId);
    console.log('roleとる', role);

    const entity = RoleEntity.Reconstruct<Role, RoleEntity>(role.toPersistence());
    entity.update({
      name: props.name,
      description: props.description,
    });

    const updatedRole = await this.roleRepository.update(this.prisma, props.roleId, entity);

    return updatedRole.toResponse();
  }
}
