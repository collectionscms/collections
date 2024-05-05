import { UserRepository } from '../../data/user/user.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';

export class DeleteUserUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly userRepository: UserRepository
  ) {}

  async execute(userId: string): Promise<void> {
    await this.userRepository.delete(this.prisma, userId);
  }
}
