type AbstractStorage = {
  get(location: string, encoding?: BufferEncoding): Promise<string>;
  put(fileNameDisk: string, content: Buffer): Promise<unknown>;
};

export abstract class Storage implements AbstractStorage {
  abstract get(location: string, encoding?: BufferEncoding): Promise<string>;
  abstract put(fileNameDisk: string, content: Buffer): Promise<unknown>;
}
