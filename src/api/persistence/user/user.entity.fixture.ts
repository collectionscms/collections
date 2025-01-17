import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';
import { v4 } from 'uuid';
import { UserEntity } from './user.entity.js';

const defaultValue = {
  id: v4(),
  name: faker.person.firstName() + ' ' + faker.person.lastName(),
  email: faker.internet.email(),
  emailVerified: null,
  password: null,
  isActive: true,
  avatarUrl: faker.image.avatarGitHub(),
  image: faker.image.avatarGitHub(),
  providerId: v4(),
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
