import { User } from '@prisma/client';
import { UserRepository } from '../../data/user/user.repository.js';
import { PrismaType } from '../../database/prisma/client.js';

export class GetMyProfileUseCase {
  constructor(
    private readonly prisma: PrismaType,
    private readonly userRepository: UserRepository
  ) {}

  async execute(userId: string): Promise<User> {
    const result = await this.userRepository.findOneById(this.prisma, userId);
    return result.toResponse();
  }
}
