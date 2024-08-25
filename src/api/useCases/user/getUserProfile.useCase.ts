import { UserProfile } from '../../../types/index.js';
import { UserRepository } from '../../persistence/user/user.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';

export class GetUserProfileUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly userRepository: UserRepository
  ) {}

  async execute(userId: string): Promise<UserProfile> {
    const userRole = await this.userRepository.findUserRole(this.prisma, userId);

    return {
      id: userRole.user.id,
      name: userRole.user.name,
      email: userRole.user.email,
      isActive: userRole.user.isActive,
      isRegistered: true,
      role: userRole.role.toResponse(),
    };
  }
}
