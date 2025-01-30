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
    const { name, userId, bio, bioUrl, employer, jobTitle, image } = props;

    const user = await this.userRepository.findOneById(this.prisma, userId);
    user.updateUser({
      name,
      bio,
      bioUrl,
      employer,
      jobTitle,
      image,
    });

    const updatedUser = await this.userRepository.updateProfile(this.prisma, user);

    return updatedUser.toResponse();
  }
}
