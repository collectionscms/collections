import { BypassPrismaType } from '../../database/prisma/client.js';
import { buildAlumnusEntity } from '../alumnus/alumnus.entity.fixture.js';
import { AlumnusEntity } from '../alumnus/alumnus.entity.js';
import { buildAwardEntity } from '../award/award.entity.fixture.js';
import { AwardEntity } from '../award/award.entity.js';
import { buildSocialProfileEntity } from '../socialProfile/socialProfile.entity.fixture.js';
import { SocialProfileEntity } from '../socialProfile/socialProfile.entity.js';
import { buildSpokenLanguageEntity } from '../spokenLanguage/spokenLanguage.entity.fixture.js';
import { SpokenLanguageEntity } from '../spokenLanguage/spokenLanguage.entity.js';
import { buildUserEntity } from './user.entity.fixture.js';
import { UserEntity } from './user.entity.js';
import { UserRepository } from './user.repository.js';

export class InMemoryUserRepository extends UserRepository {
  async findOneByIdWithProfiles(
    _prisma: BypassPrismaType,
    userId: string
  ): Promise<{
    user: UserEntity;
    socialProfiles: SocialProfileEntity[];
    alumni: AlumnusEntity[];
    spokenLanguages: SpokenLanguageEntity[];
    awards: AwardEntity[];
  } | null> {
    return {
      user: buildUserEntity({
        id: userId,
      }),
      socialProfiles: [buildSocialProfileEntity()],
      alumni: [buildAlumnusEntity()],
      spokenLanguages: [buildSpokenLanguageEntity()],
      awards: [buildAwardEntity()],
    };
  }
}
