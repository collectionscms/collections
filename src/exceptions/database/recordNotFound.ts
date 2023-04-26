import { BaseException } from '../base';

export class RecordNotFoundException extends BaseException {
  constructor(public code: string, public extensions?: Record<string, any>) {
    super(404, code, extensions);
  }
}
