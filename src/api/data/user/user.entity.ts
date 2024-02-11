import { User } from '@prisma/client';
import { v4 } from 'uuid';

export class UserEntity {
  private readonly user: User;

  constructor(user: User) {
    this.user = user;
  }

  static Construct({
    name,
    email,
    password,
    apiKey,
  }: {
    name: string;
    email: string;
    password: string;
    apiKey: string | null;
  }): UserEntity {
    return new UserEntity({
      id: v4(),
      name,
      email,
      password,
      apiKey,
      isActive: true,
      avatarUrl: null,
      resetPasswordToken: null,
      resetPasswordExpiration: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static Reconstruct(user: User): UserEntity {
    return new UserEntity(user);
  }

  private copyProps(): User {
    const copy = {
      ...this.user,
    };
    return Object.freeze(copy);
  }

  toPersistence(): User {
    return this.copyProps();
  }
}
