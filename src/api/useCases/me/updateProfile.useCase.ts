import { User } from '@prisma/client';
import { BypassPrismaType } from '../../database/prisma/client.js';
import { UserRepository } from '../../persistence/user/user.repository.js';
import { UpdateProfileUseCaseSchemaType } from './updateProfile.useCase.schema.js';

export class UpdateProfileUseCase {
  constructor(
    private readonly prisma: BypassPrismaType,
    private readonly userRepository: UserRepository
  ) {}

  async execute(props: UpdateProfileUseCaseSchemaType): Promise<User> {
    const { name, userId } = props;

    const user = await this.userRepository.findOneById(this.prisma, userId);
    user.update({
      name: name,
    });

    const updatedUser = await this.userRepository.updateProfile(this.prisma, user);

    return updatedUser.toResponse();
  }
}
