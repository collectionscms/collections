import { env } from '../../env.js';
import { File, PrimaryKey } from '../database/schemas.js';
import { getStorage } from '../storages/storage.js';
import { AbstractServiceOptions, BaseService } from './base.js';

export class FilesService extends BaseService<File> {
  constructor(options: AbstractServiceOptions) {
    super('superfast_files', options);
  }

  /**
   * @description Upload file to storage
   * @param buffer
   * @param file
   * @returns primary key
   */
  async upload(buffer: Buffer, file: Omit<File, 'id'>): Promise<PrimaryKey> {
    const storage = getStorage(env.STORAGE_DRIVER);
    await storage.put(file.file_name_disk, buffer);

    const fileId = await this.createOne(file);
    return fileId;
  }
}
