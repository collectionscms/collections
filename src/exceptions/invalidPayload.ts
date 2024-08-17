import { BaseException } from './base.js';

export class InvalidPayloadException extends BaseException {
  constructor(
    public code: string,
    public extensions?: Record<string, any>
  ) {
    super(400, code, extensions);
  }
}
