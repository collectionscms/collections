import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';
import { v4 } from 'uuid';
import { UserEntity } from './user.entity.js';

const defaultValue = {
  id: v4(),
  name: 'John Doe',
  email: 'john.doe@example.com',
  emailVerified: null,
  password: null,
  isActive: true,
  image: faker.image.avatarGitHub(),
  providerId: v4(),
  bio: null,
  bioUrl: null,
  employer: null,
  jobTitle: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const buildUserEntity = <K extends keyof User>(props?: {
  [key in K]: User[key];
}): UserEntity => {
  return UserEntity.Reconstruct<User, UserEntity>({
    ...defaultValue,
    ...props,
  });
};
