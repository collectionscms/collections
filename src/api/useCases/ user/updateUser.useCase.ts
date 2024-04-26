import { UserEntity } from '../../data/user/user.entity.js';
import { UserRepository } from '../../data/user/user.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { oneWayHash } from '../../utilities/oneWayHash.js';

export class UpdateUserUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly userRepository: UserRepository
  ) {}

  async execute(
    id: string,
    projectId: string,
    params: { name: string; email: string; password: string | undefined; roleId: string }
  ): Promise<UserEntity> {
    await this.userRepository.checkUniqueEmail(this.prisma, id, params.email);

    const user = await this.userRepository.findUserById(this.prisma, id);
    const password = params.password ? await oneWayHash(params.password) : user.password();

    const entity = UserEntity.Reconstruct({
      ...user.toPersistence(),
      name: params.name,
      password,
      email: params.email,
    });

    return await this.userRepository.updateWithRole(
      this.prisma,
      id,
      entity,
      projectId,
      params.roleId
    );
  }
}
