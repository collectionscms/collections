import { UserProfile } from '../../../types/index.js';
import { InvitationRepository } from '../../persistences/invitation/invitation.repository.js';
import { UserRepository } from '../../persistences/user/user.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';

export class GetUserProfilesUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly userRepository: UserRepository,
    private readonly invitationRepository: InvitationRepository
  ) {}

  async execute(): Promise<UserProfile[]> {
    const userRoles = await this.userRepository.findUserRoles(this.prisma);
    const invitationRoles = await this.invitationRepository.findManyByPendingStatus(this.prisma);

    return [
      ...invitationRoles.map(({ invitation, role }) => ({
        id: invitation.id,
        name: invitation.email,
        email: invitation.email,
        isActive: false,
        isRegistered: false,
        role: role.toResponse(),
      })),
      ...userRoles.map(({ user, role }) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        isRegistered: true,
        role: role.toResponse(),
      })),
    ];
  }
}
