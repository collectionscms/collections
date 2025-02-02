import { User } from '@auth/express';
import {
  Alumnus,
  Award,
  Permission,
  Project,
  Role,
  SocialProfile,
  SpokenLanguage,
} from '@prisma/client';
import { InvalidCredentialsException } from '../../../exceptions/invalidCredentials.js';
import { BypassPrismaType, ProjectPrismaType } from '../../database/prisma/client.js';
import { comparePasswords } from '../../utilities/comparePasswords.js';
import { AlumnusEntity } from '../alumnus/alumnus.entity.js';
import { AwardEntity } from '../award/award.entity.js';
import { PermissionEntity } from '../permission/permission.entity.js';
import { ProjectEntity } from '../project/project.entity.js';
import { RoleEntity } from '../role/role.entity.js';
import { SocialProfileEntity } from '../socialProfile/socialProfile.entity.js';
import { SpokenLanguageEntity } from '../spokenLanguage/spokenLanguage.entity.js';
import { UserEntity } from './user.entity.js';

export class UserRepository {
  async login(prisma: BypassPrismaType, email: string, password: string): Promise<UserEntity> {
    const user = await prisma.user.findFirst({
      where: {
        email: {
          contains: email,
        },
        isActive: true,
      },
    });

    if (!user || !user.password || !comparePasswords(user.password, password)) {
      throw new InvalidCredentialsException('incorrect_email_or_password');
    }

    return UserEntity.Reconstruct<User, UserEntity>(user);
  }

  async findOneById(prisma: BypassPrismaType, userId: string): Promise<UserEntity> {
    const record = await prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
    });

    return UserEntity.Reconstruct<User, UserEntity>(record);
  }

  async findOneWithUserRole(
    prisma: ProjectPrismaType,
    userId: string
  ): Promise<{ user: UserEntity; role: RoleEntity } | null> {
    const record = await prisma.userProject.findFirst({
      where: {
        userId,
      },
      include: {
        user: true,
        role: true,
      },
    });

    if (!record) return null;

    return {
      user: UserEntity.Reconstruct<User, UserEntity>(record.user),
      role: RoleEntity.Reconstruct<Role, RoleEntity>(record.role),
    };
  }

  async findOneByIdWithProfiles(
    prisma: BypassPrismaType,
    userId: string
  ): Promise<{
    user: UserEntity;
    socialProfiles: SocialProfileEntity[];
    alumni: AlumnusEntity[];
    spokenLanguages: SpokenLanguageEntity[];
    awards: AwardEntity[];
  } | null> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        socialProfiles: true,
        alumni: true,
        spokenLanguages: true,
        awards: true,
      },
    });

    return user
      ? {
          user: UserEntity.Reconstruct<User, UserEntity>(user),
          socialProfiles: user.socialProfiles.map((socialProfile) =>
            SocialProfileEntity.Reconstruct<SocialProfile, SocialProfileEntity>(socialProfile)
          ),
          alumni: user.alumni.map((alumnus) =>
            AlumnusEntity.Reconstruct<Alumnus, AlumnusEntity>(alumnus)
          ),
          spokenLanguages: user.spokenLanguages.map((spokenLanguage) =>
            SpokenLanguageEntity.Reconstruct<SpokenLanguage, SpokenLanguageEntity>(spokenLanguage)
          ),
          awards: user.awards.map((award) => AwardEntity.Reconstruct<Award, AwardEntity>(award)),
        }
      : null;
  }

  async findOneWithProjects(
    prisma: BypassPrismaType,
    id: string
  ): Promise<{
    user: UserEntity;
    projectRoles: {
      project: ProjectEntity;
      role: RoleEntity;
      permissions: PermissionEntity[];
    }[];
  }> {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        userProjects: {
          include: {
            project: true,
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      user: UserEntity.Reconstruct<User, UserEntity>(user),
      projectRoles: user.userProjects.map((userProject) => {
        return {
          project: ProjectEntity.Reconstruct<Project, ProjectEntity>(userProject.project),
          role: RoleEntity.Reconstruct<Role, RoleEntity>(userProject.role),
          permissions: userProject.role.rolePermissions.map((rolePermission) =>
            PermissionEntity.Reconstruct<Permission, PermissionEntity>(rolePermission.permission)
          ),
        };
      }),
    };
  }

  async findMany(prisma: ProjectPrismaType): Promise<UserEntity[]> {
    const records = await prisma.userProject.findMany({
      include: {
        user: true,
        role: true,
      },
    });

    return records.map((record) => UserEntity.Reconstruct<User, UserEntity>(record.user));
  }

  async findManyWithUserRoles(
    prisma: ProjectPrismaType
  ): Promise<{ user: UserEntity; role: RoleEntity; updatedAt: Date }[]> {
    const records = await prisma.userProject.findMany({
      include: {
        user: true,
        role: true,
      },
    });

    return records.map((record) => {
      return {
        user: UserEntity.Reconstruct<User, UserEntity>(record.user),
        role: RoleEntity.Reconstruct<Role, RoleEntity>(record.role),
        updatedAt: record.updatedAt,
      };
    });
  }

  async updateProfile(prisma: BypassPrismaType, user: UserEntity): Promise<UserEntity> {
    user.beforeUpdateValidate();

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: user.name,
        bio: user.bio,
        bioUrl: user.bioUrl,
        employer: user.employer,
        jobTitle: user.jobTitle,
        image: user.image,
      },
    });

    return UserEntity.Reconstruct<User, UserEntity>(updatedUser);
  }
}
