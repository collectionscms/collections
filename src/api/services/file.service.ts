import { env } from '../../env.js';
import { getStorage } from '../storages/storage.js';

export class FileService {
  /**
   * @description Upload file to storage
   * @param buffer
   * @param fileNameDisk
   * @returns file
   */
  async upload(buffer: Buffer, fileNameDisk: string): Promise<void> {
    const storage = getStorage(env.STORAGE_DRIVER);
    await storage.put(fileNameDisk, buffer);
  }
}
