import { AwsS3Storage } from './drivers/AwsS3Storage.js';
import { LocalFileSystemStorage } from './drivers/LocalFileSystemStorage.js';
import { Storage } from './drivers/base.js';

export const getStorage = (driver: string): Storage => {
  if (driver === 'aws-s3') {
    return new AwsS3Storage();
  }

  return new LocalFileSystemStorage();
};
