import fse from 'fs-extra';
import { env } from '../../../env.js';
import { pathList } from '../../../utilities/pathList.js';
import { Storage } from './base.js';

export class LocalFileSystemStorage implements Storage {
  key(fileNameDisk: string): string {
    return pathList.storageRoot(fileNameDisk);
  }

  get(key: string, encoding: BufferEncoding = 'base64'): Promise<string> {
    const result = fse.readFile(key, encoding);
    return result;
  }

  getBuffer(key: string): Promise<Buffer> {
    return fse.readFile(key);
  }

  put(fileNameDisk: string, content: Buffer): Promise<unknown> {
    const filePath = `./${env.STORAGE_LOCAL_ROOT}/${fileNameDisk}`;
    const result = fse.outputFile(filePath, content);
    return result;
  }
}
