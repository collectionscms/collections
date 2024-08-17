import { BaseException } from '../base.js';

export class InvalidSecretKeyException extends BaseException {
  constructor(
    public code: string,
    public extensions?: Record<string, any>
  ) {
    super(403, code, extensions);
  }
}
