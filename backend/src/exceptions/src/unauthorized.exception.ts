import { BaseException } from './base.exception';

export class UnauthorizedException extends BaseException {
  
  public constructor(msg: string | string[]) {
    super(UnauthorizedException.code, msg);
  }

  static code = 'unauthorized';
}
