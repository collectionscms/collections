import { Me } from '../../../types/index.js';
import { MeRepository } from '../../data/user/me.repository.js';
import { BypassPrismaType } from '../../database/prisma/client.js';

export class LoginUseCase {
  constructor(
    private readonly prisma: BypassPrismaType,
    private readonly meRepository: MeRepository
  ) {}

  async execute(email: string, password: string): Promise<Me> {
    const user = await this.meRepository.login(this.prisma, email, password);

    return {
      id: user.id,
      email: user.email,
    };
  }
}
