import { User } from '@prisma/client';
import dayjs from 'dayjs';
import { v4 } from 'uuid';
import { oneWayHash } from '../../utilities/oneWayHash.js';
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

  get confirmedAt(): Date | null {
    return this.props.confirmedAt;
  }

  get resetPasswordToken(): string | null {
    return this.props.resetPasswordToken;
  }

  get resetPasswordExpiration(): Date | null {
    return this.props.resetPasswordExpiration;
  }

  resetPassword(): void {
    this.props.resetPasswordToken = v4();
    this.props.resetPasswordExpiration = dayjs().add(1, 'hour').toDate();
  }

  generateConfirmationToken(): void {
    this.props.confirmationToken = v4();
  }

  async hashPassword(password: string): Promise<void> {
    this.props.password = await oneWayHash(password);
  }

  verified(): void {
    this.props.confirmedAt = new Date();
    this.props.isActive = true;
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
