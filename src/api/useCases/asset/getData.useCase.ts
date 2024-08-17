import { File } from '@prisma/client';
import { Buffer } from 'buffer';
import { FileRepository } from '../../persistences/file/file.repository.js';
import { ProjectPrismaType } from '../../database/prisma/client.js';
import { getStorage } from '../../storages/storage.js';

type GetDataUseCaseResponse = {
  file: File;
  data: Buffer;
};

export class GetDataUseCase {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly fileRepository: FileRepository
  ) {}

  async execute(fileId: string): Promise<GetDataUseCaseResponse> {
    const entity = await this.fileRepository.findFile(this.prisma, fileId);

    const storage = getStorage(entity.storage);
    const key = storage.key(entity.fileNameDisk);
    const data = await storage.getBuffer(key);

    return {
      file: entity.toResponse(),
      data,
    };
  }
}
