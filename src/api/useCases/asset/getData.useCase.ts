import { File } from '@prisma/client';
import { Buffer } from 'buffer';
import { RecordNotFoundException } from '../../../exceptions/database/recordNotFound.js';
import { BypassPrismaClient } from '../../database/prisma/client.js';
import { FileRepository } from '../../persistence/file/file.repository.js';
import { getStorage } from '../../storages/storage.js';

type GetDataUseCaseResponse = {
  file: File;
  data: Buffer;
};

export class GetDataUseCase {
  constructor(
    private readonly prisma: BypassPrismaClient,
    private readonly fileRepository: FileRepository
  ) {}

  async execute(projectId: string | null, fileId: string): Promise<GetDataUseCaseResponse> {
    const entity = await this.fileRepository.findFile(this.prisma, projectId, fileId);
    if (!entity) {
      throw new RecordNotFoundException('record_not_found');
    }

    const storage = getStorage(entity.storage);
    const key = storage.key(entity.fileNameDisk);
    const data = await storage.getBuffer(key);

    return {
      file: entity.toResponse(),
      data,
    };
  }
}
