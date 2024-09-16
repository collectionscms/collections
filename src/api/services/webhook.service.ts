import axios from 'axios';
import { PublishedContent } from '../../types/index.js';
import { logger } from '../../utilities/logger.js';
import { ProjectPrismaType } from '../database/prisma/client.js';
import {
  WebhookLogEntity,
  WebhookTriggerEventType,
} from '../persistence/webhookLog/webhookLog.entity.js';
import { WebhookLogRepository } from '../persistence/webhookLog/webhookLog.repository';
import { WebhookSettingRepository } from '../persistence/webhookSetting/webhookSetting.repository';

export class WebhookService {
  constructor(
    private readonly webhookSettingRepository: WebhookSettingRepository,
    private readonly webhookLogRepository: WebhookLogRepository
  ) {}

  async send(
    prisma: ProjectPrismaType,
    projectId: string,
    triggerEvent: WebhookTriggerEventType,
    content: PublishedContent | null
  ): Promise<void> {
    const settings = await this.webhookSettingRepository.findManyByProjectId(prisma, projectId);

    for (const setting of settings) {
      let response;
      try {
        if (setting.url) {
          response = await axios.post(setting.url, { id: content?.id, triggerEvent, content });
        }
      } catch (error) {
        logger.warn(`Failed to send webhook for id:${setting.id}`, error);
      } finally {
        const entity = WebhookLogEntity.Construct({
          projectId,
          name: setting.name,
          url: setting.url,
          triggerEvent,
          provider: setting.provider,
          status: response && response.status < 400 ? 'success' : 'error',
          responseCode: response ? response.status : null,
          responseBody: response ? JSON.stringify(response.data) : null,
        });

        await this.webhookLogRepository.create(prisma, entity);
      }
    }
  }
}
