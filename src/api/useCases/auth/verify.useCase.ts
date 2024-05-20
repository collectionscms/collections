import { PrismaClient } from '@prisma/client';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { Me } from '../../../types/index.js';
import { UserRepository } from '../../data/user/user.repository.js';
import { VerifyUseCaseSchemaType } from './verify.schema.js';
import { ConflictException } from '../../../exceptions/conflict.js';

export class VerifyUseCase {
  constructor(
    private readonly prisma: PrismaClient,
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
