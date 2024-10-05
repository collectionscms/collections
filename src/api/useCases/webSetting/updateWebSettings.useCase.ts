import { WebhookSetting } from '@prisma/client';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
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
    if (!webhookSetting) {
      throw new RecordNotFoundException('record_not_found');
    }

    webhookSetting.update({
      name: props.name,
      url: props.url,
      enabled: props.enabled,
      onPublish: props.onPublish,
      onArchive: props.onArchive,
      onDeletePublished: props.onDeletePublished,
      onRestorePublished: props.onRestorePublished,
    });

    const result = await this.webhookSettingRepository.update(this.prisma, webhookSetting);

    return result.toResponse();
  }
}
