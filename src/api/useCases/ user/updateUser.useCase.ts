import { UserEntity } from '../../data/user/user.entity.js';
import { UserRepository } from '../../data/user/user.repository.js';
import { PrismaType, ProjectPrismaClient } from '../../database/prisma/client.js';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { UpdateUserUseCaseSchemaType } from './updateUser.schema.js';

export class UpdateUserUseCase {
  constructor(
    private readonly prisma: PrismaType,
    private readonly projectPrisma: ProjectPrismaClient,
    private readonly userRepository: UserRepository
  ) {}

  async execute(props: UpdateUserUseCaseSchemaType): Promise<UserEntity> {
    const { id: userId, projectId, name, roleId, email, password } = props;

    await this.userRepository.checkUniqueEmail(this.prisma, userId, email);

    const user = await this.userRepository.findUserById(this.projectPrisma, projectId, userId);
    const hashed = password ? await oneWayHash(password) : user.password;

    return await this.userRepository.updateWithRole(this.projectPrisma, userId, projectId, roleId, {
      name: name,
      email: email,
      password: hashed,
    });
  }
}
