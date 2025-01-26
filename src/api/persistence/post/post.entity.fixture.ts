import { Post } from '@prisma/client';
import { v4 } from 'uuid';
import { PostEntity } from './post.entity.js';

const defaultValue = {
  id: v4(),
  projectId: v4(),
  createdById: v4(),
  isInit: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const buildPostEntity = <K extends keyof Post>(props?: {
  [key in K]: Post[key];
}): PostEntity => {
  return PostEntity.Reconstruct<Post, PostEntity>({
    ...defaultValue,
    ...props,
  });
};
