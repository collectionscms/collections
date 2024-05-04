import { UserProfile } from '../../../types/index.js';
import { UserRepository } from '../../data/user/user.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';

export class GetUserProfilesUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly userRepository: UserRepository
  ) {}

  async execute(projectId: string): Promise<UserProfile[]> {
    const userRoles = await this.userRepository.findUserRoles(this.prisma, projectId);

    return userRoles.map((userRole) => {
      return {
        id: userRole.user.id,
        name: userRole.user.name,
        email: userRole.user.email,
        isActive: userRole.user.isActive,
        role: userRole.role.toResponse(),
      };
    });
  }
}
