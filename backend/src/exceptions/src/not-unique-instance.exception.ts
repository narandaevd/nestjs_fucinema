import { BaseException } from './base.exception';

export class NotUniqueInstanceException extends BaseException {
  
  public constructor(msg: string | string[]) {
    super(NotUniqueInstanceException.code, msg);
  }

  static code = 'not_unique_instance';
}

