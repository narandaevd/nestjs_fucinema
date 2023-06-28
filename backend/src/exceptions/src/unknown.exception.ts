import { BaseException } from './base.exception';

export class UnknownException extends BaseException {

  public constructor(e: unknown) {
    super(UnknownException.code, 'Извините, возникли некоторые неполадки');
    this.error = e as Error;
  }

  public readonly error: Error;
  static code = 'unknown';
}
