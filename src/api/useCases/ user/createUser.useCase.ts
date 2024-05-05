import { User } from '@prisma/client';
import { UserEntity } from '../../data/user/user.entity.js';
import { UserRepository } from '../../data/user/user.repository.js';
import { PrismaType, ProjectPrismaType } from '../../database/prisma/client.js';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { CreateUserUseCaseSchemaType } from './createUser.schema.js';

export class CreateUserUseCase {
  constructor(
    private readonly prisma: PrismaType,
    private readonly projectPrisma: ProjectPrismaType,
    private readonly userRepository: UserRepository
  ) {}

  async execute(props: CreateUserUseCaseSchemaType): Promise<User> {
    const { projectId, name, email, password, apiKey, roleId } = props;

    await this.userRepository.checkUniqueEmail(this.prisma, '', email);

    const hashed = await oneWayHash(password);

    const entity = UserEntity.Construct({
      name,
      email,
      password: hashed,
      apiKey,
    });

    const user = await this.userRepository.create(this.projectPrisma, entity, projectId, roleId);

    return user.toResponse();
  }
}
