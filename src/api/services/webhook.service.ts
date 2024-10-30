import axios from 'axios';
import { logger } from '../../utilities/logger.js';
import { ProjectPrismaType } from '../database/prisma/client.js';
import { ContentEntity } from '../persistence/content/content.entity.js';
import { ContentTagRepository } from '../persistence/contentTag/contentTag.repository.js';
import { UserRepository } from '../persistence/user/user.repository.js';
import {
  WebhookLogEntity,
  WebhookTriggerEventType,
} from '../persistence/webhookLog/webhookLog.entity.js';
import { WebhookLogRepository } from '../persistence/webhookLog/webhookLog.repository';
import { WebhookSettingRepository } from '../persistence/webhookSetting/webhookSetting.repository';

export class WebhookService {
  constructor(
    private readonly webhookSettingRepository: WebhookSettingRepository,
    private readonly webhookLogRepository: WebhookLogRepository,
    private readonly userRepository: UserRepository,
    private readonly contentTagRepository: ContentTagRepository
  ) {}

  /**
   * Send webhook to the specified URL
   * @param prisma
   * @param triggerEvent
   * @param newContent
   */
  async send(
    prisma: ProjectPrismaType,
    triggerEvent: WebhookTriggerEventType,
    newContent: ContentEntity
  ): Promise<void> {
    const settings = await this.webhookSettingRepository.findEnabledManyByProjectId(
      prisma,
      newContent.projectId
    );

    const createdBy = await this.userRepository.findOneById(prisma, newContent.createdById);
    const tags = await this.contentTagRepository.findTagsByContentId(prisma, newContent.id);

    for (const setting of settings) {
      if (!setting.canSend(triggerEvent)) continue;

      let response;
      try {
        if (setting.url) {
          response = await axios.post(setting.url, {
            id: newContent.id,
            triggerEvent,
            new: newContent.toPublishedContentResponse(createdBy, tags),
          });
        }
      } catch (error) {
        logger.warn(`Failed to send webhook for id:${setting.id}`, error);
      } finally {
        const entity = WebhookLogEntity.Construct({
          projectId: newContent.projectId,
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
