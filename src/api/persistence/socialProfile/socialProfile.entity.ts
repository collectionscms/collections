import { SocialProfile } from '@prisma/client';
import { v4 } from 'uuid';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export type SocialProfileProvider = 'x' | 'instagram' | 'facebook' | 'linkedIn';

export class SocialProfileEntity extends PrismaBaseEntity<SocialProfile> {
  static Construct({
    userId,
    provider,
    url,
  }: {
    userId: string;
    provider: SocialProfileProvider;
    url: string | null;
  }): SocialProfileEntity {
    const now = new Date();
    return new SocialProfileEntity({
      id: v4(),
      userId,
      provider,
      url,
      createdAt: now,
      updatedAt: now,
    });
  }
}
