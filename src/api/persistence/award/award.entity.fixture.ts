import { Award } from '@prisma/client';
import { v4 } from 'uuid';
import { AwardEntity } from './award.entity.js';

const defaultValue = {
  id: v4(),
  userId: v4(),
  name: 'Best Developer',
  url: 'https://example.com/award',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const buildAwardEntity = <K extends keyof Award>(props?: {
  [key in K]: Award[key];
}): AwardEntity => {
  return AwardEntity.Reconstruct<Award, AwardEntity>({
    ...defaultValue,
    ...props,
  });
};
