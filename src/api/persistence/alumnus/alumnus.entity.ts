import { Alumnus } from '@prisma/client';
import { v4 } from 'uuid';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class AlumnusEntity extends PrismaBaseEntity<Alumnus> {
  static Construct({
    userId,
    name,
    url,
  }: {
    userId: string;
    name: string;
    url: string | null;
  }): AlumnusEntity {
    const now = new Date();
    return new AlumnusEntity({
      id: v4(),
      userId,
      name,
      url,
      createdAt: now,
      updatedAt: now,
    });
  }
}
