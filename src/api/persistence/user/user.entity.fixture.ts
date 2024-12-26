import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';
import { v4 } from 'uuid';
import { AuthProvider, UserEntity } from './user.entity.js';

const defaultValue = {
  id: v4(),
  name: faker.person.firstName() + ' ' + faker.person.lastName(),
  email: faker.internet.email(),
  password: null,
  isActive: true,
  avatarUrl: faker.image.avatarGitHub(),
  provider: AuthProvider.google,
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
