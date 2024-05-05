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
    const { projectId, name, email, password, userId } = props;

    await this.userRepository.checkUniqueEmail(this.prisma, userId, email);

    const hashed = password ? await oneWayHash(password) : undefined;
    const user = await this.userRepository.findUserById(this.projectPrisma, projectId, userId);
    user.update({
      name: name,
      email: email,
      password: hashed,
    });

    const updatedUser = await this.userRepository.update(this.projectPrisma, props.userId, user);

    return updatedUser.toResponse();
  }
}
