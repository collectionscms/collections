import { BaseException } from './base.js';

export class ConflictException extends BaseException {
  constructor(
    public code: string,
    public extensions?: Record<string, any>
  ) {
    super(409, code, extensions);
  }
}
