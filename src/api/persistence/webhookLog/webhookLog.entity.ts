import { WebhookLog } from '@prisma/client';
import { v4 } from 'uuid';
import { UnexpectedException } from '../../../exceptions/unexpected.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export const WebhookTriggerEvent = {
  publish: 'publish',
  archive: 'archive',
  deletePublished: 'deletePublished',
} as const;
export type WebhookTriggerEventType =
  (typeof WebhookTriggerEvent)[keyof typeof WebhookTriggerEvent];

type WebhookLogProps = Omit<WebhookLog, 'id' | 'createdAt'>;

export class WebhookLogEntity extends PrismaBaseEntity<WebhookLog> {
  static Construct(props: WebhookLogProps): WebhookLogEntity {
    const now = new Date();
    return new WebhookLogEntity({
      id: v4(),
      projectId: props.projectId,
      name: props.name,
      url: props.url,
      triggerEvent: props.triggerEvent,
      provider: props.provider,
      status: props.status,
      responseCode: props.responseCode,
      responseBody: props.responseBody,
      createdAt: now,
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
