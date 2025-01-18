import { User } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class UserEntity extends PrismaBaseEntity<User> {
  static Construct({
    name,
    email,
    isActive,
  }: {
    name: string;
    email: string;
    isActive: boolean;
  }): UserEntity {
    const now = new Date();
    return new UserEntity({
      id: v4(),
      name,
      email,
      emailVerified: null,
      password: null,
      image: null,
      isActive,
      createdAt: now,
      updatedAt: now,
    });
  }

  private isValid() {
    if (!this.props.id) {
      throw new UnexpectedException({ message: 'id is required' });
    }
  }

  beforeUpdateValidate(): void {
    this.isValid();
  }

  beforeInsertValidate(): void {
    this.isValid();
  }

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get name(): string {
    return this.props.name ?? '';
  }

  get password(): string | null {
    return this.props.password;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get image(): string | null {
    return this.props.image;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
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
