import { WebhookSetting } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { WebhookSettingEntity } from '../../persistence/webhookSetting/webhookSetting.entity.js';
import { WebhookSettingRepository } from '../../persistence/webhookSetting/webhookSetting.repository.js';
import { CreateWebSettingsUseCaseSchemaType } from './createWebSettings.useCase.schema.js';

export class CreateWebSettingsUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly webhookSettingRepository: WebhookSettingRepository
  ) {}

  async execute(props: CreateWebSettingsUseCaseSchemaType): Promise<WebhookSetting> {
    const entity = WebhookSettingEntity.Construct({
      ...props,
      requestHeaders: null,
      secret: null,
      enabled: true,
    });
    const result = await this.webhookSettingRepository.create(this.prisma, entity);

    return result.toResponse();
  }
}
