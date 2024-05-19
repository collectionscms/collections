import { User } from '@prisma/client';
import { v4 } from 'uuid';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class UserEntity extends PrismaBaseEntity<User> {
  static Construct({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): UserEntity {
    return new UserEntity({
      id: v4(),
      name,
      email,
      password,
      isActive: true,
      confirmationToken: null,
      confirmedAt: null,
      avatarUrl: null,
      resetPasswordToken: null,
      resetPasswordExpiration: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get name(): string {
    return this.props.name;
  }

  get password(): string {
    return this.props.password;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  update(params: { name?: string; email?: string; password?: string }) {
    if (params.name) {
      this.props.name = params.name;
    }

    if (params.email) {
      this.props.email = params.email;
    }

    if (params.password) {
      this.props.password = params.password;
    }
  }
}
