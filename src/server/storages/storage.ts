import { LocalFileSystemStorage } from './drivers/LocalFileSystemStorage.js';
import { Storage } from './drivers/base.js';

export const getStorage = (): Storage => {
  return new LocalFileSystemStorage();
};
