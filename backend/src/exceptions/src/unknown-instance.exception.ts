import { BaseException } from './base.exception';

export class UnknownInstanceException extends BaseException {
  
  public constructor(msg: string | string[]) {
    super(UnknownInstanceException.code, msg);
  }

  static code = 'unknown_instance';
}
