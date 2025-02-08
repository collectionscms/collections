import { SocialProfile } from '@prisma/client';
import { v4 } from 'uuid';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export const SocialProfileProvider = {
  X: 'x',
  Instagram: 'instagram',
  Facebook: 'facebook',
  LinkedIn: 'linkedIn',
} as const;

export type SocialProfileProvider =
  (typeof SocialProfileProvider)[keyof typeof SocialProfileProvider];

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

  get provider() {
    return this.props.provider;
  }

  get url() {
    return this.props.url;
  }
}
