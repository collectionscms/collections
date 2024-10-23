import { UserProfile } from '../../../types/index.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { InvitationRepository } from '../../persistence/invitation/invitation.repository.js';
import { UserRepository } from '../../persistence/user/user.repository.js';

export class GetUserProfilesUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly userRepository: UserRepository,
    private readonly invitationRepository: InvitationRepository
  ) {}

  async execute(): Promise<UserProfile[]> {
    const userRoles = await this.userRepository.findManyWithUserRoles(this.prisma);
    const invitationRoles = await this.invitationRepository.findManyByPendingStatus(this.prisma);

    return [
      ...invitationRoles.map(({ invitation, role }) => ({
        id: invitation.id,
        name: invitation.email,
        email: invitation.email,
        isActive: false,
        isRegistered: false,
        role: role.toResponse(),
        updatedAt: invitation.updatedAt,
      })),
      ...userRoles.map(({ user, role, updatedAt }) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        isRegistered: true,
        role: role.toResponse(),
        updatedAt,
      })),
    ];
  }
}
