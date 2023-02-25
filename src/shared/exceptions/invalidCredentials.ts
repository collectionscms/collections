import { BaseException } from './base';

export class InvalidCredentialsException extends BaseException {
  constructor(
    public message: string = 'Invalid user credentials.',
    public extensions?: Record<string, any>
  ) {
    super(401, 'INVALID_CREDENTIALS', message, extensions);
  }
}
