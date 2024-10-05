import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { WebhookSettingRepository } from '../../persistence/webhookSetting/webhookSetting.repository.js';
import { GetWebSettingUseCaseSchemaType } from './getWebSetting.useCase.schema.js';

export class DeleteWebSettingUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly webhookSettingRepository: WebhookSettingRepository
  ) {}

  async execute(props: GetWebSettingUseCaseSchemaType): Promise<void> {
    const webhookSetting = await this.webhookSettingRepository.findOne(this.prisma, props.id);
    if (!webhookSetting) {
      throw new RecordNotFoundException('record_not_found');
    }

    await this.webhookSettingRepository.delete(this.prisma, webhookSetting);
  }
}
