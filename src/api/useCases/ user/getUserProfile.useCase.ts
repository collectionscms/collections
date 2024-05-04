import { UserProfile } from '../../../types/index.js';
import { UserRepository } from '../../data/user/user.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';

export class GetUserProfileUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly userRepository: UserRepository
  ) {}

  async execute(projectId: string, userId: string): Promise<UserProfile> {
    const userRole = await this.userRepository.findUserRole(this.prisma, projectId, userId);

    return {
      id: userRole.user.id,
      name: userRole.user.name,
      email: userRole.user.email,
      isActive: userRole.user.isActive,
      role: userRole.role.toResponse(),
    };
  }
}
