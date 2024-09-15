import { v4 } from 'uuid';
import { WebhookSettingProps } from '../../persistence/webhookSetting/webhookSetting.entity.js';
import { BypassPrismaType } from '../prisma/client.js';

export const createWebhookSettings = async (
  prisma: BypassPrismaType,
  webhookSettings: WebhookSettingProps[]
): Promise<void> => {
  for (const webhookSetting of webhookSettings) {
    await prisma.webhookSetting.create({
      data: {
        id: v4(),
        ...webhookSetting,
      },
    });
  }
};
