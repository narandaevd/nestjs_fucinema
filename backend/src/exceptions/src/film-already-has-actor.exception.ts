import { BaseException } from './base.exception';

export class FilmAlreadyHasActorException extends BaseException {
  public constructor() {
    super(FilmAlreadyHasActorException.code, 'У фильма уже есть этот актёр');
  }

  static code = 'film-already-has-actor';
}
