import {
  Film,
  UpdateFilmDto,
  AuthResultCode,
  IProfanityChecker
} from '../../../../domain';
import {
  IFilmRepository,
  FILM_REPOSITORY_TOKEN,
  IFilmPagination
} from '../../../../repository-contracts';
import { 
  NotFoundException,
  UnauthorizedException,
  ProfanityException,
} from '../../../../exceptions';
import {BaseConfiguration} from '../../../../config';
import {
  ILogService,
  LOG_SERVICE
} from '../../log-contract';

import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../../user/services/auth.service';
import {FilmConfig} from '../film.config';
import {FILM_CONFIGURATION_TOKEN, PROFANITY_CHECKER_TOKEN} from '../consts';
import {ERROR_SERVICE, IErrorService} from '../../common';

@Injectable()
export class FilmService {
  public constructor(
    @Inject(FILM_REPOSITORY_TOKEN)
    private readonly filmRepository: IFilmRepository,
    @Inject(PROFANITY_CHECKER_TOKEN)
    private readonly profanityService: IProfanityChecker,
    @Inject(FILM_CONFIGURATION_TOKEN)
    private readonly filmConfiguration: BaseConfiguration<FilmConfig>,
    private readonly authService: AuthService,
    @Inject(LOG_SERVICE)
    private readonly logService: ILogService,
    @Inject(ERROR_SERVICE)
    private readonly errorService: IErrorService,
  ) {}

  public async getMany(skip?: number, take?: number): Promise<IFilmPagination> {
    const {defaultSkip, defaultTake} = this.filmConfiguration.getConfig();
    if (!skip)
      skip = defaultSkip;
    if (!take)
      take = defaultTake;
    await this.logService.debug({skip: skip, take: take}, 'Были запрошены фильмы');
    try {
      return await this.filmRepository.findManyAndTotalCount(skip, take);
    } catch (e: unknown) {
      await this.errorService.logAndThrowIfConnectionRefused(e);
      await this.errorService.logAndThrowIfUnknown(e);
    }
  }

  public async getOneWithDetails(uuid: string): Promise<Film> {
    await this.logService.debug({uuid}, 'Был запрошен фильм');
    try {
      
      const film = await this.filmRepository.getOneWithDetails(uuid);
      film.reports?.forEach(r => delete r.user?.password);
      return film;

    } catch (e: unknown) {
      await this.errorService.logAndThrowIfConnectionRefused(e);
      if (e instanceof NotFoundException) {
        await this.logService.warning(e);
        throw e;
      }
      await this.errorService.logAndThrowIfUnknown(e);
    }
  }

  public async update(
    dto: UpdateFilmDto,
    login: string,
    password: string,
  ): Promise<Film> {
    await this.logService.debug({login, dto}, 'Изменение данных о фильме');
    const loginRes = await this.authService.login(login, password);
    if (loginRes.code === AuthResultCode.Failure) {
      const msg = 'Логин или пароль неверные';
      await this.logService.warning({
        login,
        action: 'Обновить информацию о фильме'
      }, msg);
      throw new UnauthorizedException(msg);
    }

    const profanityWords = this
      .filmConfiguration
      .getConfig()
      .profanity
      .list;
    if (this
      .profanityService
      .isContainsAnyProfanityWord(dto.description, profanityWords)
    ) {
      const msg = 'Содержание отзыва не должно содержать мат';
      await this.logService.warning({
        login,
        userUuid: loginRes.user.uuid,
        description: dto.description,
        filmUuid: dto.uuid,
      }, msg);
      throw new ProfanityException(msg);
    }

    let updatedFilm: Film;
    try {
      updatedFilm = await this.filmRepository.update(dto);
    } catch (e: unknown) {
      await this.errorService.logAndThrowIfConnectionRefused(e);
      await this.errorService.logAndThrowIfUnknown(e);
    }
    if (!updatedFilm) {
      const msg = 'Фильм с этим uuid не существует';
      await this.logService.warning({
        login,
        userUuid: loginRes.user.uuid,
        description: dto.description,
        filmUuid: dto.uuid,
      }, msg);
      throw new NotFoundException(msg);
    }
    return updatedFilm;
  }
}
