import { BaseException } from './base.js';

export class InvalidQueryException extends BaseException {
  constructor(public extensions?: Record<string, any>) {
    super(400, 'invalid_query', extensions);
  }
}
