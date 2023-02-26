import { BaseException } from './base';

export class UnprocessableEntityException extends BaseException {
  constructor(public code: string, public extensions?: Record<string, any>) {
    super(422, code, extensions);
  }
}
