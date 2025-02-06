import { SocialProfile } from '@prisma/client';
import { v4 } from 'uuid';
import { SocialProfileEntity } from './socialProfile.entity.js';

const defaultValue = {
  id: v4(),
  userId: v4(),
  provider: 'x',
  url: 'https://x.com/johndoe',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const buildSocialProfileEntity = <K extends keyof SocialProfile>(props?: {
  [key in K]: SocialProfile[key];
}): SocialProfileEntity => {
  return SocialProfileEntity.Reconstruct<SocialProfile, SocialProfileEntity>({
    ...defaultValue,
    ...props,
  });
};
