import { User } from '@prisma/client';
import { v4 } from 'uuid';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export const Provider = {
  email: 'email',
} as const;
export type ProviderType = (typeof Provider)[keyof typeof Provider];

export class UserEntity extends PrismaBaseEntity<User> {
  static Construct({
    name,
    email,
    password,
    isActive,
    provider,
  }: {
    name: string;
    email: string;
    password: string;
    isActive: boolean;
    provider: ProviderType;
  }): UserEntity {
    return new UserEntity({
      id: v4(),
      name,
      email,
      password,
      isActive,
      provider,
      avatarUrl: null,
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

  get password(): string | null {
    return this.props.password;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get avatarUrl(): string | null {
    return this.props.avatarUrl;
  }

  async hashPassword(password: string): Promise<void> {
    this.props.password = await oneWayHash(password);
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
