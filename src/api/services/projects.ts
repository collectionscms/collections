import { PrismaClient } from '@prisma/client';
import { RecordNotFoundException } from '../../exceptions/database/recordNotFound.js';

export class ProjectsService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findProject() {
    return this.prisma.project.findFirst();
  }

  async update(data: { name?: string; beforeLogin?: string; afterLogin?: string }) {
    const project = await this.findProject();
    if (!project) throw new RecordNotFoundException('record_not_found');

    return this.prisma.project.update({
      where: { id: project.id },
      data,
    });
  }
}
