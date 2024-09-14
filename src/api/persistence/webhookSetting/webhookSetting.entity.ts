import { WebhookSetting } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

type WebhookSettingProps = Omit<WebhookSetting, 'id' | 'enabled' | 'createdAt' | 'updatedAt'>;

export class WebhookSettingEntity extends PrismaBaseEntity<WebhookSetting> {
  static Construct(props: WebhookSettingProps): WebhookSettingEntity {
    const now = new Date();
    return new WebhookSettingEntity({
      id: v4(),
      projectId: props.projectId,
      name: props.name,
      enabled: true,
      serviceType: props.serviceType,
      url: props.url,
      secret: props.secret,
      requestHeaders: props.requestHeaders,
      onPublish: props.onPublish,
      onReview: props.onReview,
      onArchive: props.onArchive,
      onDeletePublished: props.onDeletePublished,
      createdAt: now,
      updatedAt: now,
    });
  }

  private isValid() {
    if (!this.props.id) {
      throw new UnexpectedException({ message: 'id is required' });
    }
  }

  public beforeUpdateValidate(): void {
    this.isValid();
  }

  public beforeInsertValidate(): void {
    this.isValid();
  }
}
