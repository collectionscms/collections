type AbstractStorage = {
  put(fileNameDisk: string, content: Buffer): Promise<unknown>;
};

export abstract class Storage implements AbstractStorage {
  abstract put(fileNameDisk: string, content: Buffer): Promise<unknown>;
}
