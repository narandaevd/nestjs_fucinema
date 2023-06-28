import { BaseException } from './base.exception';

export class DatabaseConnectionRefusedException extends BaseException {
  public constructor() {
    super(
      DatabaseConnectionRefusedException.code,
      'Соединение с хранилищем потеряно'
    );
  }

  static code = 'database_connection_refused';
}
