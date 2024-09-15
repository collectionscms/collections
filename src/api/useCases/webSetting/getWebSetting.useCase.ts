import { WebhookSetting } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { WebhookSettingRepository } from '../../persistence/webhookSetting/webhookSetting.repository.js';
import { GetWebSettingUseCaseSchemaType } from './getWebSetting.useCase.schema.js';

export class GetWebSettingUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly webhookSettingRepository: WebhookSettingRepository
  ) {}

  async execute(props: GetWebSettingUseCaseSchemaType): Promise<WebhookSetting> {
    const record = await this.webhookSettingRepository.findOne(this.prisma, props.id);
    return record.toResponse();
  }
}
