import { BaseException } from './base.exception';

export class ProfanityException extends BaseException {
  public constructor(msg: string | string[]) {
    super(ProfanityException.code, msg);
  }

  static code = 'profanity';
}

