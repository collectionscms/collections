import { BaseException } from './base.js';

export class InvalidCredentialsException extends BaseException {
  constructor(
    public code: string,
    public extensions?: Record<string, any>
  ) {
    super(401, code, extensions);
  }
}
