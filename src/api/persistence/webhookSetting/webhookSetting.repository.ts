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

  async findOne(prisma: ProjectPrismaType, id: string): Promise<WebhookSettingEntity | null> {
    const webhookSetting = await prisma.webhookSetting.findUnique({
      where: {
        id,
      },
    });

    if (!webhookSetting) return null;

    return WebhookSettingEntity.Reconstruct<WebhookSetting, WebhookSettingEntity>(webhookSetting);
  }

  async findEnabledManyByProjectId(
    prisma: ProjectPrismaType,
    projectId: string
  ): Promise<WebhookSettingEntity[]> {
    const records = await prisma.webhookSetting.findMany({
      where: {
        projectId,
        enabled: true,
      },
    });
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
      },
    });
    return WebhookSettingEntity.Reconstruct<WebhookSetting, WebhookSettingEntity>(result);
  }

  async update(
    prisma: ProjectPrismaType,
    entity: WebhookSettingEntity
  ): Promise<WebhookSettingEntity> {
    entity.beforeUpdateValidate();

    const record = entity.toPersistence();
    const result = await prisma.webhookSetting.update({
      where: {
        id: entity.id,
      },
      data: {
        name: record.name,
        url: record.url,
        enabled: record.enabled,
        onPublish: record.onPublish,
        onArchive: record.onArchive,
        onDeletePublished: record.onDeletePublished,
        onRestorePublished: record.onRestorePublished,
        onRevert: record.onRevert,
      },
    });
    return WebhookSettingEntity.Reconstruct<WebhookSetting, WebhookSettingEntity>(result);
  }

  async delete(prisma: ProjectPrismaType, entity: WebhookSettingEntity): Promise<void> {
    await prisma.webhookSetting.delete({
      where: {
        id: entity.id,
      },
    });
  }
}
