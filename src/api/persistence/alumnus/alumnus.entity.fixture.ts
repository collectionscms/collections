import { Alumnus } from '@prisma/client';
import { v4 } from 'uuid';
import { AlumnusEntity } from './alumnus.entity.js';

const defaultValue = {
  id: v4(),
  userId: v4(),
  name: 'UCLA',
  url: 'https://www.ucla.edu',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const buildAlumnusEntity = <K extends keyof Alumnus>(props?: {
  [key in K]: Alumnus[key];
}): AlumnusEntity => {
  return AlumnusEntity.Reconstruct<Alumnus, AlumnusEntity>({
    ...defaultValue,
    ...props,
  });
};
