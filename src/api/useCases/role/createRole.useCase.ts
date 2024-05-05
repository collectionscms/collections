import { Role } from '@prisma/client';
import { RoleEntity } from '../../data/role/role.entity.js';
import { RoleRepository } from '../../data/role/role.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { CreateRoleUseCaseSchemaType } from './createRole.schema.js';

export class CreateRoleUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly roleRepository: RoleRepository
  ) {}

  async execute(props: CreateRoleUseCaseSchemaType): Promise<Role> {
    const entity = RoleEntity.Construct(props);
    const role = await this.roleRepository.create(this.prisma, entity);

    return role.toResponse();
  }
}
