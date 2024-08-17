import { ConflictException } from '../../../exceptions/conflict.js';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { Me } from '../../../types/index.js';
import { UserRepository } from '../../persistences/user/user.repository.js';
import { BypassPrismaClient } from '../../database/prisma/client.js';
import { VerifyUseCaseSchemaType } from './verify.schema.js';

export class VerifyUseCase {
  constructor(
    private readonly prisma: BypassPrismaClient,
    private readonly userRepository: UserRepository
  ) {}

  async execute(props: VerifyUseCaseSchemaType): Promise<Me> {
    const user = await this.userRepository.findOneByConfirmationToken(this.prisma, props.token);

    if (!user) {
      throw new RecordNotFoundException('record_not_found');
    }

    if (user.confirmedAt) {
      throw new ConflictException('already_confirmed');
    }

    user.verified();
    await this.userRepository.verified(this.prisma, user);

    return {
      id: user.id,
      email: user.email,
    };
  }
}
