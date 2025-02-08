import { Award } from '@prisma/client';
import { v4 } from 'uuid';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class AwardEntity extends PrismaBaseEntity<Award> {
  static Construct({ userId, name }: { userId: string; name: string }): AwardEntity {
    const now = new Date();
    return new AwardEntity({
      id: v4(),
      userId,
      name,
      createdAt: now,
      updatedAt: now,
    });
  }

  get name() {
    return this.props.name;
  }
}
