import { Me } from '../../../types/index.js';
import { UserRepository } from '../../persistence/user/user.repository.js';
import { BypassPrismaType } from '../../database/prisma/client.js';

export class LoginUseCase {
  constructor(
    private readonly prisma: BypassPrismaType,
    private readonly userRepository: UserRepository
  ) {}

  async execute(email: string, password: string): Promise<Me> {
    const user = await this.userRepository.login(this.prisma, email, password);

    return {
      id: user.id,
      email: user.email,
    };
  }
}
