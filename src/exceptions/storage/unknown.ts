import { BaseException } from '../base.js';

export class UnknownException extends BaseException {
  constructor(
    public code: string,
    public extensions?: Record<string, any>
  ) {
    super(500, code, extensions);
  }
}
