import { Prisma, TextGenerationUsage } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

type TextGenerationUsageProps = Omit<TextGenerationUsage, 'id' | 'createdAt'>;

export class TextGenerationUsageEntity extends PrismaBaseEntity<TextGenerationUsage> {
  static Construct(props: TextGenerationUsageProps): TextGenerationUsageEntity {
    return new TextGenerationUsageEntity({
      id: v4(),
      ...props,
      createdAt: new Date(),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get sourceText(): Prisma.JsonValue {
    return this.props.sourceText;
  }

  get generatedText(): Prisma.JsonValue {
    return this.props.generatedText;
  }

  get createdAt(): Date {
    return this.props.createdAt;
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
}
