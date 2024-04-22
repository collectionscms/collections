import { File } from '@prisma/client';
import { env } from '../../../env.js';

export class FileEntity {
  private readonly file: File;

  constructor(file: File) {
    this.file = file;
  }

  id(): string {
    return this.file.id;
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

  toResponse(): File & { url: string } {
    return {
      ...this.copyProps(),
      url: this.url(),
    };
  }
}
