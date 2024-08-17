import { User } from '@prisma/client';
import { UserRepository } from '../../persistences/user/user.repository.js';
import { BypassPrismaType } from '../../database/prisma/client.js';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { UpdateProfileUseCaseSchemaType } from './updateProfile.schema.js';

export class UpdateProfileUseCase {
  constructor(
    private readonly prisma: BypassPrismaType,
    private readonly userRepository: UserRepository
  ) {}

  async execute(props: UpdateProfileUseCaseSchemaType): Promise<User> {
    const { name, email, password, userId } = props;

    await this.userRepository.checkUniqueEmail(this.prisma, email, userId);

    const hashed = password ? await oneWayHash(password) : undefined;
    const user = await this.userRepository.findOneById(this.prisma, userId);
    user.update({
      name: name,
      email: email,
      password: hashed,
    });

    const updatedUser = await this.userRepository.updateProfile(this.prisma, user);

    return updatedUser.toResponse();
  }
}
