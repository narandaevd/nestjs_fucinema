import { BaseException } from './base.exception';

export class BackendHasntPermissionsException extends BaseException {
  public constructor() {
    super(
      BackendHasntPermissionsException.code,
      'Нет привилегий для операций'
    );
  }

  static code = BackendHasntPermissionsException.name;
}
