import { BaseException } from './base.exception';

export class DatabaseIsReadonlyException extends BaseException {
  public constructor() {
    super(
      DatabaseIsReadonlyException.code,
      'База данных запущена в режиме на чтение'
    );
  }

  static code = DatabaseIsReadonlyException.name;
}
