import { UserEntity } from '../../data/user/user.entity.js';
import { UserRepository } from '../../data/user/user.repository.js';
import { PrismaType, ProjectPrismaClient } from '../../database/prisma/client.js';
import { oneWayHash } from '../../utilities/oneWayHash.js';

export class UpdateUserUseCase {
  constructor(
    private readonly prisma: PrismaType,
    private readonly projectPrisma: ProjectPrismaClient,
    private readonly userRepository: UserRepository
  ) {}

  async execute(
    userId: string,
    projectId: string,
    params: { name: string; email: string; password: string | undefined; roleId: string }
  ): Promise<UserEntity> {
    await this.userRepository.checkUniqueEmail(this.prisma, userId, params.email);

    const user = await this.userRepository.findUserById(this.projectPrisma, userId);
    const password = params.password ? await oneWayHash(params.password) : user.password();

    return await this.userRepository.updateWithRole(
      this.projectPrisma,
      userId,
      projectId,
      params.roleId,
      {
        name: params.name,
        email: params.email,
        password,
      }
    );
  }
}
