import { BaseException } from './base.js';

export class UnauthorizedException extends BaseException {
  constructor(public extensions?: Record<string, any>) {
    super(401, 'unauthorized', extensions);
  }
}
