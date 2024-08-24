import { File } from '@prisma/client';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { BypassPrismaClient } from '../../database/prisma/client.js';
import { FileRepository } from '../../persistences/file/file.repository.js';

type GetFileUseCaseResponse = {
  file: File & { url: string };
};

export class GetFileUseCase {
  constructor(
    private readonly prisma: BypassPrismaClient,
    private readonly fileRepository: FileRepository
  ) {}

  async execute(projectId: string | null, fileId: string): Promise<GetFileUseCaseResponse> {
    const entity = await this.fileRepository.findFile(this.prisma, projectId, fileId);
    if (!entity) {
      throw new RecordNotFoundException('record_not_found');
    }

    return {
      file: entity.toResponseWithUrl(),
    };
  }
}
