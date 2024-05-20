import { User } from '@prisma/client';
import { v4 } from 'uuid';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class UserEntity extends PrismaBaseEntity<User> {
  static Construct({
    name,
    email,
    password,
    isActive,
  }: {
    name: string;
    email: string;
    password: string;
    isActive: boolean;
  }): UserEntity {
    return new UserEntity({
      id: v4(),
      name,
      email,
      password,
      isActive,
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

  get confirmationToken(): string | null {
    return this.props.confirmationToken;
  }

  generateConfirmationToken(): void {
    this.props.confirmationToken = v4();
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
