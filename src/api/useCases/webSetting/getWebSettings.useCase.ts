import { WebhookSetting } from '@prisma/client';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { WebhookSettingRepository } from '../../persistence/webhookSetting/webhookSetting.repository.js';

export class GetWebSettingsUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly webhookSettingRepository: WebhookSettingRepository
  ) {}

  async execute(): Promise<WebhookSetting[]> {
    const records = await this.webhookSettingRepository.findMany(this.prisma);

    return records.map((record) => {
      return record.toResponse();
    });
  }
}
