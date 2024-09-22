import { User } from '@prisma/client';
import { v4 } from 'uuid';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export const AuthProvider = {
  email: 'email',
  github: 'github',
  google: 'google',
} as const;
export type AuthProviderType = (typeof AuthProvider)[keyof typeof AuthProvider];

export class UserEntity extends PrismaBaseEntity<User> {
  static Construct({
    name,
    email,
    isActive,
    provider,
    providerId,
  }: {
    name: string;
    email: string;
    isActive: boolean;
    provider: AuthProviderType;
    providerId: string;
  }): UserEntity {
    const now = new Date();
    return new UserEntity({
      id: v4(),
      name,
      email,
      password: null,
      isActive,
      provider,
      providerId,
      avatarUrl: null,
      createdAt: now,
      updatedAt: now,
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

  get password(): string | null {
    return this.props.password;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get avatarUrl(): string | null {
    return this.props.avatarUrl;
  }

  get provider(): string {
    return this.props.provider;
  }

  get providerId(): string {
    return this.props.providerId;
  }

  async hashPassword(password: string): Promise<void> {
    this.props.password = await oneWayHash(password);
  }

  update(params: { name?: string }) {
    if (params.name) {
      this.props.name = params.name;
    }
  }
}
