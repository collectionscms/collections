import { User } from '@prisma/client';
import { MeRepository } from '../../data/user/me.repository.js';
import { PrismaType } from '../../database/prisma/client.js';

export class GetMyProfileUseCase {
  constructor(
    private readonly prisma: PrismaType,
    private readonly meRepository: MeRepository
  ) {}

  async execute(userId: string): Promise<User> {
    const result = await this.meRepository.findMeById(this.prisma, userId);
    return result.toResponse();
  }
}
