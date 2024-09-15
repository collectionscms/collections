import { WebhookSetting } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { WebhookSettingRepository } from '../../persistence/webhookSetting/webhookSetting.repository.js';
import { UpdateWebSettingsUseCaseSchemaType } from './updateWebSettings.useCase.schema.js';

export class UpdateWebSettingsUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly webhookSettingRepository: WebhookSettingRepository
  ) {}

  async execute(props: UpdateWebSettingsUseCaseSchemaType): Promise<WebhookSetting> {
    const webhookSetting = await this.webhookSettingRepository.findOne(this.prisma, props.id);

    webhookSetting.update({
      name: props.name,
      url: props.url,
      enabled: props.enabled,
      onPublish: props.onPublish,
      onArchive: props.onArchive,
      onUpdatePublished: props.onUpdatePublished,
      onDeletePublished: props.onDeletePublished,
    });

    const result = await this.webhookSettingRepository.update(this.prisma, webhookSetting);

    return result.toResponse();
  }
}
