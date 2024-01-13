import { File, PrismaClient } from '@prisma/client';
import { env } from '../../env.js';
import { getStorage } from '../storages/storage.js';

export class FilesService {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findFile(id: string) {
    return this.prisma.file.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  /**
   * @description Upload file to storage
   * @param buffer
   * @param file
   * @returns file
   */
  async upload(buffer: Buffer, file: File): Promise<File> {
    const storage = getStorage(env.STORAGE_DRIVER);
    await storage.put(file.fileNameDisk, buffer);

    const uploadedFile = await this.prisma.file.create({
      data: file,
    });

    return uploadedFile;
  }
}
