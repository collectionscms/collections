import { BaseException } from './base.js';

export class UnexpectedException extends BaseException {
  constructor(public extensions?: Record<string, any>) {
    super(500, 'unexpected', extensions);
  }
}
