import { PrismaClient } from '@prisma/client';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';

export class ProjectSettingsService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findProjectSetting() {
    return this.prisma.projectSetting.findFirst();
  }

  async update(data: { name?: string; beforeLogin?: string; afterLogin?: string }) {
    const projectSetting = await this.findProjectSetting();
    if (!projectSetting) throw new RecordNotFoundException('record_not_found');

    return this.prisma.projectSetting.update({
      where: { id: projectSetting.id },
      data,
    });
  }
}
