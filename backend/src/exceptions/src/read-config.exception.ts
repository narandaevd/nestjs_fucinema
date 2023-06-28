import { BaseException } from './base.exception';

export class ReadConfigException extends BaseException {
  
  public constructor(msg: string | string[]) {
    super(ReadConfigException.code, msg);
  }

  static code = 'profanity';
}

