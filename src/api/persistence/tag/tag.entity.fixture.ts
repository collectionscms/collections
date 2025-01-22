import { Tag } from '@prisma/client';
import { v4 } from 'uuid';
import { TagEntity } from './tag.entity.js';

const defaultValue = {
  id: v4(),
  projectId: v4(),
  name: 'tag name',
};

export const buildTagEntity = <K extends keyof Tag>(props?: {
  [key in K]: Tag[key];
}): TagEntity => {
  return TagEntity.Reconstruct<Tag, TagEntity>({
    ...defaultValue,
    ...props,
  });
};
