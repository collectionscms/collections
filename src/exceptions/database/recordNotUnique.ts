import { BaseException } from '../base';

export class RecordNotUniqueException extends BaseException {
  constructor(public code: string, public extensions?: Record<string, any>) {
    super(400, code, extensions);
  }
}
