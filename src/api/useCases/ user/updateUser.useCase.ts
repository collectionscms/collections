import { PrismaClient } from '@prisma/client';
import { UserEntity } from '../../data/user/user.entity.js';
import { UserRepository } from '../../data/user/user.repository.js';
import { prisma } from '../../database/prisma/client.js';
import { oneWayHash } from '../../utilities/oneWayHash.js';

export class UpdateUserUseCase {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly userRepository: UserRepository
  ) {}

  async execute(
    id: string,
    projectId: string,
    params: { email: string; password: string | undefined; roleId: string }
  ): Promise<UserEntity> {
    await this.userRepository.checkUniqueEmail(this.prisma, id, params.email);

    const user = await this.userRepository.findUserById(this.prisma, id);
    const password = params.password ? await oneWayHash(params.password) : user.password();

    const entity = UserEntity.Reconstruct({
      ...user.toPersistence(),
      password,
      email: params.email,
    });

    return await this.userRepository.updateWithRole(prisma, id, entity, projectId, params.roleId);
  }
}
