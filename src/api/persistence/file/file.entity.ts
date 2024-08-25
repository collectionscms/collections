import { File } from '@prisma/client';
import { v4 } from 'uuid';
import { env } from '../../../env.js';
import { PrismaBaseEntity } from '../prismaBaseEntity.js';

export class FileEntity extends PrismaBaseEntity<File> {
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
    projectId: string | null;
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
    return this.props.id;
  }

  get projectId(): string | null {
    return this.props.projectId;
  }

  get storage(): string {
    return this.props.storage;
  }

  get fileNameDisk(): string {
    return this.props.fileNameDisk;
  }

  path(): string {
    return `/assets/${this.props.id}`;
  }

  url(subdomain: string): string {
    const portalUrl = env.PUBLIC_SERVER_ORIGIN;
    const url = portalUrl.replace(/:\/\/(.*?)\./, `://${subdomain}.`);
    return `${url}${this.path()}`;
  }

  toResponseWithUrl(subdomain: string): File & { url: string } {
    return {
      ...this.props,
      url: this.url(subdomain),
    };
  }
}
