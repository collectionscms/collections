import {
  Alumnus,
  Award,
  SocialProfile,
  SpokenLanguage,
  User,
  UserExperience,
} from '@prisma/client';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { BypassPrismaClient, BypassPrismaType } from '../../database/prisma/client.js';
import { AlumnusEntity } from '../../persistence/alumnus/alumnus.entity.js';
import { AlumnusRepository } from '../../persistence/alumnus/alumnus.repository.js';
import { AwardEntity } from '../../persistence/award/award.entity.js';
import { AwardRepository } from '../../persistence/award/award.repository.js';
import { ExperienceEntity } from '../../persistence/experience/experience.entity.js';
import {
  SocialProfileEntity,
  SocialProfileProvider,
} from '../../persistence/socialProfile/socialProfile.entity.js';
import { SocialProfileRepository } from '../../persistence/socialProfile/socialProfile.repository.js';
import { SpokenLanguageEntity } from '../../persistence/spokenLanguage/spokenLanguage.entity.js';
import { SpokenLanguageRepository } from '../../persistence/spokenLanguage/spokenLanguage.repository.js';
import { UserRepository } from '../../persistence/user/user.repository.js';
import { UserExperienceEntity } from '../../persistence/userExperience/userExperience.entity.js';
import { UserExperienceRepository } from '../../persistence/userExperience/userExperience.repository.js';
import { UserProjectRepository } from '../../persistence/userProject/userProject.repository.js';
import { UpdateProfileUseCaseSchemaType } from './updateProfile.useCase.schema.js';

export class UpdateProfileUseCase {
  constructor(
    private readonly prisma: BypassPrismaClient,
    private readonly userRepository: UserRepository,
    private readonly awardRepository: AwardRepository,
    private readonly alumnusRepository: AlumnusRepository,
    private readonly socialProfileRepository: SocialProfileRepository,
    private readonly spokenLanguageRepository: SpokenLanguageRepository,
    private readonly userExperienceRepository: UserExperienceRepository,
    private readonly userProjectRepository: UserProjectRepository
  ) {}

  async execute(props: UpdateProfileUseCaseSchemaType): Promise<{
    user: User;
    socialProfiles: SocialProfile[];
    awards: Award[];
    alumni: Alumnus[];
    spokenLanguages: SpokenLanguage[];
    experiences: UserExperience[];
  }> {
    const {
      name,
      userId,
      bio,
      bioUrl,
      employer,
      jobTitle,
      image,
      xUrl,
      instagramUrl,
      facebookUrl,
      linkedInUrl,
      awards,
      spokenLanguages,
      alumni,
      experiences,
    } = props;

    const user = await this.userRepository.findOneById(this.prisma, userId);
    user.updateUser({
      name,
      bio,
      bioUrl,
      employer,
      jobTitle,
      image,
    });

    // filter out empty urls
    const socialProfiles = [
      {
        provider: SocialProfileProvider.X,
        url: xUrl,
      },
      {
        provider: SocialProfileProvider.Instagram,
        url: instagramUrl,
      },
      {
        provider: SocialProfileProvider.Facebook,
        url: facebookUrl,
      },
      {
        provider: SocialProfileProvider.LinkedIn,
        url: linkedInUrl,
      },
    ].filter((profile) => profile.url);

    // filter out empty strings
    const filteredAlumni = alumni.filter((alumnus) => alumnus.name || alumnus.url);

    const projectWithExperiences =
      await this.userProjectRepository.findManyWithProjectExperiencesByUserId(this.prisma, userId);
    const allExperiences = projectWithExperiences.flatMap(
      (projectWithExperience) => projectWithExperience.experiences
    );
    const experienceById = allExperiences.reduce<Record<string, ExperienceEntity>>(
      (acc, experience) => {
        acc[experience.id] = experience;
        return acc;
      },
      {}
    );

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedUser = await this.userRepository.updateProfile(tx, user);

      // delete all existing records
      await Promise.all([
        this.awardRepository.deleteManyByUserId(tx, userId),
        this.alumnusRepository.deleteManyByUserId(tx, userId),
        this.socialProfileRepository.deleteManyByUserId(tx, userId),
        this.spokenLanguageRepository.deleteManyByUserId(tx, userId),
        this.userExperienceRepository.deleteManyByUserId(tx, userId),
      ]);

      // create new records
      const socialProfileEntities = socialProfiles.map((profile) =>
        SocialProfileEntity.Construct({
          provider: profile.provider,
          url: profile.url || null,
          userId,
        })
      );

      const awardEntities = awards.map((award) =>
        AwardEntity.Construct({
          name: award,
          userId,
        })
      );

      const alumnusEntities = filteredAlumni.map((alumnus) =>
        AlumnusEntity.Construct({
          name: alumnus.name,
          url: alumnus.url,
          userId,
        })
      );

      const spokenLanguageEntities = spokenLanguages.map((language) =>
        SpokenLanguageEntity.Construct({
          language,
          userId,
        })
      );

      const userExperienceEntities = experiences.map((experience) => {
        const experienceEntity = experienceById[experience.value];
        if (!experienceEntity) {
          throw new RecordNotFoundException(`Experience with id ${experience.value} not found`);
        }

        return UserExperienceEntity.Construct({
          projectId: experienceEntity.projectId,
          experienceId: experienceEntity.id,
          userId,
        });
      });

      const createEntities = async <T>(
        repository: { createMany(tx: BypassPrismaType, entities: T[]): Promise<void> },
        entities: T[]
      ) => {
        if (entities.length > 0) {
          await repository.createMany(tx, entities);
        }
      };

      await Promise.all([
        createEntities(this.socialProfileRepository, socialProfileEntities),
        createEntities(this.awardRepository, awardEntities),
        createEntities(this.alumnusRepository, alumnusEntities),
        createEntities(this.spokenLanguageRepository, spokenLanguageEntities),
        createEntities(this.userExperienceRepository, userExperienceEntities),
      ]);

      return {
        user: updatedUser,
        socialProfiles: socialProfileEntities,
        awards: awardEntities,
        alumni: alumnusEntities,
        spokenLanguages: spokenLanguageEntities,
        experiences: userExperienceEntities,
      };
    });

    return {
      user: result.user.toResponse(),
      socialProfiles: result.socialProfiles.map((profile) => profile.toResponse()),
      awards: result.awards.map((award) => award.toResponse()),
      alumni: result.alumni.map((alumnus) => alumnus.toResponse()),
      spokenLanguages: result.spokenLanguages.map((language) => language.toResponse()),
      experiences: result.experiences.map((experience) => experience.toResponse()),
    };
  }
}
