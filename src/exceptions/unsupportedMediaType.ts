import { BaseException } from './base.js';

export class UnsupportedMediaTypeException extends BaseException {
  constructor(public extensions?: Record<string, any>) {
    super(415, 'unsupported_media_type', extensions);
  }
}
