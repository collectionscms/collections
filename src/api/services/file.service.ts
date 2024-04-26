import { env } from '../../env.js';
import { FileEntity } from '../data/file/file.entity.js';
import { FileRepository } from '../data/file/file.repository.js';
import { ProjectPrismaType } from '../database/prisma/client.js';
import { getStorage } from '../storages/storage.js';

export class FileService {
  constructor(
    private readonly prisma: ProjectPrismaType,
    private readonly fileRepository: FileRepository
  ) {}

  /**
   * @description Upload file to storage
   * @param buffer
   * @param file
   * @returns file
   */
  async upload(buffer: Buffer, file: FileEntity): Promise<FileEntity> {
    const storage = getStorage(env.STORAGE_DRIVER);
    await storage.put(file.fileNameDisk, buffer);

    const entity = await this.fileRepository.upload(this.prisma, file);
    return entity;
  }
}
