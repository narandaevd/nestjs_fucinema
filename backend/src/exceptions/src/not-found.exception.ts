import { BaseException } from './base.exception';

export class NotFoundException extends BaseException {
  public constructor(msg: string | string[]) {
    super(NotFoundException.code, msg);
  }

  static code = 'not_found';
}
