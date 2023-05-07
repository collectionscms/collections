type AbstractStorage = {
  get(location: string, encoding?: BufferEncoding): Promise<string>;
  put(fileNameDisk: string, content: Buffer): Promise<unknown>;
};

export abstract class Storage implements AbstractStorage {
  // Returns the raw data of the file. Encoding can be selected from base64, utf8, etc.
  abstract get(location: string, encoding?: BufferEncoding): Promise<string>;

  // Save the file to a storage location. The data returned depends on the selected storage driver.
  abstract put(fileNameDisk: string, content: Buffer): Promise<unknown>;
}
