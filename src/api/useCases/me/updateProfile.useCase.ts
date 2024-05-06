import { User } from '@prisma/client';
import { MeRepository } from '../../data/user/me.repository.js';
import { UserRepository } from '../../data/user/user.repository.js';
import { PrismaType } from '../../database/prisma/client.js';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { UpdateProfileUseCaseSchemaType } from './updateProfile.schema.js';

export class UpdateProfileUseCase {
  constructor(
    private readonly prisma: PrismaType,
    private readonly meRepository: MeRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(props: UpdateProfileUseCaseSchemaType): Promise<User> {
    const { name, email, password, userId } = props;

    await this.userRepository.checkUniqueEmail(this.prisma, userId, email);

    const hashed = password ? await oneWayHash(password) : undefined;
    const user = await this.meRepository.findMeById(this.prisma, userId);
    user.update({
      name: name,
      email: email,
      password: hashed,
    });

    const updatedUser = await this.meRepository.update(this.prisma, props.userId, user);

    return updatedUser.toResponse();
  }
}
