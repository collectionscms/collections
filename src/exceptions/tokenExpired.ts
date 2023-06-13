import { BaseException } from './base.js';

export class TokenExpiredException extends BaseException {
  constructor(public extensions?: Record<string, any>) {
    super(401, 'token_expired', extensions);
  }
}
