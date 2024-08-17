import { User } from '@prisma/client';
import { UserRepository } from '../../persistences/user/user.repository.js';
import { BypassPrismaType } from '../../database/prisma/client.js';
import { ResetPasswordUseCaseSchemaType } from './resetPassword.schema.js';

export class ResetPasswordUseCase {
  constructor(
    private readonly prisma: BypassPrismaType,
    private readonly userRepository: UserRepository
  ) {}

  async execute(props: ResetPasswordUseCaseSchemaType): Promise<User> {
    const user = await this.userRepository.findOneByResetToken(this.prisma, props.token);
    user.hashPassword(props.password);

    const result = await this.userRepository.updatePassword(this.prisma, user);
    return result.toResponse();
  }
}
