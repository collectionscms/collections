import {
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { env } from '../../../env.js';
import { InvalidAuthorizationException } from '../../../exceptions/storage/invalidAuthorization.js';
import { InvalidSecretKeyException } from '../../../exceptions/storage/invalidSecretKey.js';
import { UnknownException } from '../../../exceptions/storage/unknown.js';
import { Storage } from './base.js';

export class AwsS3Storage implements Storage {
  key(fileNameDisk: string): string {
    return fileNameDisk;
  }

  async get(key: string, encoding: BufferEncoding = 'base64'): Promise<string> {
    try {
      const result = await this.client().send(
        new GetObjectCommand({
          Bucket: env.STORAGE_BUCKET,
          Key: key,
        })
      );
      const obj = result.Body?.transformToString(encoding);
      return obj ?? '';
    } catch (e: any) {
      throw this.handleError(e, key, env.STORAGE_BUCKET);
    }
  }

  async getBuffer(key: string): Promise<Buffer> {
    try {
      const result = await this.client().send(
        new GetObjectCommand({
          Bucket: env.STORAGE_BUCKET,
          Key: key,
        })
      );

      const object = await result.Body!.transformToByteArray();
      const buffer = Buffer.from(object);

      return buffer;
    } catch (e: any) {
      throw this.handleError(e, key, env.STORAGE_BUCKET);
    }
  }

  async put(fileNameDisk: string, content: Buffer): Promise<PutObjectCommandOutput> {
    try {
      const output = await this.client().send(
        new PutObjectCommand({
          Bucket: env.STORAGE_BUCKET,
          Key: fileNameDisk,
          Body: content,
        })
      );
      return output;
    } catch (e: any) {
      throw this.handleError(e, fileNameDisk, env.STORAGE_BUCKET);
    }
  }

  client = () => {
    return new S3Client({
      region: env.STORAGE_REGION,
      credentials: {
        accessKeyId: env.STORAGE_KEY,
        secretAccessKey: env.STORAGE_SECRET,
      },
    });
  };

  // see: https://docs.aws.amazon.com/AmazonS3/latest/API/ErrorResponses.html
  handleError(e: Error, key: string, bucket: string): Error {
    const extension = {
      message: `key: ${key}, bucket: ${bucket}, error name: ${e.name}, error msg: ${e.message}`,
    };

    switch (e.name) {
      case 'AuthorizationHeaderMalformed':
        return new InvalidAuthorizationException('invalid_access_key', extension);
      case 'SignatureDoesNotMatch':
        return new InvalidSecretKeyException('invalid_secret_key', extension);
      default:
        return new UnknownException('internal_server_error', extension);
    }
  }
}
