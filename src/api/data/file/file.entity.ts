import { File } from '@prisma/client';
import { v4 } from 'uuid';
import { env } from '../../../env.js';

export class FileEntity {
  private readonly file: File;

  constructor(file: File) {
    this.file = file;
  }

  static Construct({
    projectId,
    storage,
    fileName,
    fileNameDisk,
    type,
    fileSize,
    width,
    height,
  }: {
    projectId: string;
    storage: string;
    fileName: string;
    fileNameDisk: string;
    type: string;
    fileSize: number | null;
    width: number | null;
    height: number | null;
  }): FileEntity {
    const now = new Date();
    return new FileEntity({
      id: v4(),
      projectId,
      storage,
      fileName,
      fileNameDisk,
      type,
      fileSize,
      width,
      height,
    });
  }

  get id(): string {
    return this.file.id;
  }

  get storage(): string {
    return this.file.storage;
  }

  get fileNameDisk(): string {
    return this.file.fileNameDisk;
  }

  url(): string {
    return `${env.PUBLIC_SERVER_URL}/assets/${this.file.id}`;
  }

  static Reconstruct(file: File): FileEntity {
    return new FileEntity(file);
  }

  private copyProps(): File {
    const copy = {
      ...this.file,
    };
    return Object.freeze(copy);
  }

  toPersistence(): File {
    return this.copyProps();
  }

  toResponse(): File & { url: string } {
    return {
      ...this.copyProps(),
      url: this.url(),
    };
  }
}
