import fse from 'fs-extra';
import { env } from '../../../env.js';
import { Storage } from './base.js';

export class LocalFileSystemStorage implements Storage {
  get(location: string, encoding: BufferEncoding = 'base64'): Promise<string> {
    const result = fse.readFile(location, encoding);
    return result;
  }

  put(fileNameDisk: string, content: Buffer): Promise<unknown> {
    const filePath = `./${env.STORAGE_LOCAL_ROOT}/${fileNameDisk}`;
    const result = fse.outputFile(filePath, content);
    return result;
  }
}
