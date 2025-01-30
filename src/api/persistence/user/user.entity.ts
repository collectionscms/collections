import { User } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { oneWayHash } from '../../utilities/oneWayHash.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

type UserProps = Omit<
  User,
  | 'id'
  | 'emailVerified'
  | 'password'
  | 'image'
  | 'bio'
  | 'bioUrl'
  | 'employer'
  | 'jobTitle'
  | 'createdAt'
  | 'updatedAt'
>;

export class UserEntity extends PrismaBaseEntity<User> {
  static Construct(props: UserProps): UserEntity {
    const now = new Date();
    return new UserEntity({
      id: v4(),
      name: props.name,
      email: props.email,
      emailVerified: null,
      password: null,
      image: null,
      isActive: props.isActive,
      bio: null,
      bioUrl: null,
      employer: null,
      jobTitle: null,
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

  get bio(): string | null {
    return this.props.bio;
  }

  get bioUrl(): string | null {
    return this.props.bioUrl;
  }

  get employer(): string | null {
    return this.props.employer;
  }

  get jobTitle(): string | null {
    return this.props.jobTitle;
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

  updateUser({
    name,
    bio,
    bioUrl,
    employer,
    jobTitle,
    image,
  }: {
    name?: string | null;
    bio?: string | null;
    bioUrl?: string | null;
    employer?: string | null;
    jobTitle?: string | null;
    image?: string | null;
  }): void {
    Object.assign(this.props, {
      ...(name !== undefined && { name }),
      ...(bio !== undefined && { bio }),
      ...(bioUrl !== undefined && { bioUrl }),
      ...(employer !== undefined && { employer }),
      ...(jobTitle !== undefined && { jobTitle }),
      ...(image !== undefined && { image }),
    });
  }
}
