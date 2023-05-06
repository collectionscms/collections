import fse from 'fs-extra';
import { env } from '../../../env.js';
import { Storage } from './base.js';

export class LocalFileSystemStorage implements Storage {
  put(fileNameDisk: string, content: Buffer): Promise<unknown> {
    const filePath = `./${env.STORAGE_LOCAL_ROOT}/${fileNameDisk}`;
    const result = fse.outputFile(filePath, content);
    return result;
  }
}
