import { ContentTag } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

type ContentTagProps = Omit<ContentTag, 'id' | 'createdAt'>;

export class ContentTagEntity extends PrismaBaseEntity<ContentTag> {
  static Construct(props: ContentTagProps): ContentTagEntity {
    return new ContentTagEntity({
      id: v4(),
      ...props,
      createdAt: new Date(),
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
}
