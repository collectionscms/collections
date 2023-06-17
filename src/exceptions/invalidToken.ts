import { BaseException } from './base.js';

export class InvalidTokenException extends BaseException {
  constructor(public extensions?: Record<string, any>) {
    super(403, 'invalid_token', extensions);
  }
}
