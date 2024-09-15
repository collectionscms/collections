import { WebhookLog } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { WebhookLogEntity } from './webhookLog.entity.js';

export class WebhookLogRepository {
  async create(prisma: ProjectPrismaType, entity: WebhookLogEntity): Promise<WebhookLogEntity> {
    entity.beforeInsertValidate();

    const result = await prisma.webhookLog.create({
      data: {
        ...entity.toPersistence(),
      },
    });
    return WebhookLogEntity.Reconstruct<WebhookLog, WebhookLogEntity>(result);
  }
}
