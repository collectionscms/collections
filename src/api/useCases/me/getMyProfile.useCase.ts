import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { AuthorProfile } from '../../../types/index.js';
import { BypassPrismaType } from '../../database/prisma/client.js';
import { UserRepository } from '../../persistence/user/user.repository.js';

export class GetMyProfileUseCase {
  constructor(
    private readonly prisma: BypassPrismaType,
    private readonly userRepository: UserRepository
  ) {}

  async execute(userId: string): Promise<AuthorProfile | null> {
    const result = await this.userRepository.findOneByIdWithProfiles(this.prisma, userId);
    if (!result) throw new RecordNotFoundException('record_not_found');

    return {
      user: result.user.toResponse(),
      socialProfiles: result.socialProfiles.map((socialProfile) => socialProfile.toResponse()),
      alumni: result.alumni.map((alumnus) => alumnus.toResponse()),
      spokenLanguages: result.spokenLanguages.map((spokenLanguage) => spokenLanguage.toResponse()),
      awards: result.awards.map((award) => award.toResponse()),
    };
  }
}
