import { BaseException } from './base.exception';

export class InvalidInputDataException extends BaseException {
  public constructor(msg: string) {
    super(InvalidInputDataException.code, msg);
  }

  static code = 'invalid_input_data';
}
