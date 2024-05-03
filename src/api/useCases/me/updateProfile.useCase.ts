import { User } from '@prisma/client';
import { UserRepository } from '../../data/user/user.repository.js';
import { PrismaType, ProjectPrismaType } from '../../database/prisma/client.js';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { UpdateProfileUseCaseSchemaType } from './updateProfile.schema.js';

export class UpdateProfileUseCase {
  constructor(
    private readonly prisma: PrismaType,
    private readonly projectPrisma: ProjectPrismaType,
    private readonly userRepository: UserRepository
  ) {}

  async execute(props: UpdateProfileUseCaseSchemaType): Promise<User> {
    await this.userRepository.checkUniqueEmail(this.prisma, props.userId, props.email);

    const password = props.password ? await oneWayHash(props.password) : undefined;

    const user = await this.userRepository.findUserById(this.projectPrisma, props.userId);
    user.update({
      name: props.name,
      email: props.email,
      password,
    });

    const updatedUser = await this.userRepository.update(this.projectPrisma, props.userId, user);

    return updatedUser.toResponse();
  }
}
