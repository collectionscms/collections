import { WebhookSetting } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { WebhookSettingEntity } from './webhookSetting.entity.js';

export class WebhookSettingRepository {
  async findMany(prisma: ProjectPrismaType): Promise<WebhookSettingEntity[]> {
    const records = await prisma.webhookSetting.findMany();
    return records.map((record) =>
      WebhookSettingEntity.Reconstruct<WebhookSetting, WebhookSettingEntity>(record)
    );
  }

  async create(
    prisma: ProjectPrismaType,
    entity: WebhookSettingEntity
  ): Promise<WebhookSettingEntity> {
    entity.beforeInsertValidate();

    const result = await prisma.webhookSetting.create({
      data: {
        ...entity.toPersistence(),
        requestHeaders: entity.requestHeaders,
      },
    });
    return WebhookSettingEntity.Reconstruct<WebhookSetting, WebhookSettingEntity>(result);
  }
}
