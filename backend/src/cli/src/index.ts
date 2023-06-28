import {DatabaseModule} from '../../database';
import { 
  FilmService,
  AuthService,
  ReportService,
  REPORT_RATER_SERVICE_TOKEN,
  IReportRaterService,
} from '../../service-layer';
import {
  AuthResult, 
  User,
  RateBody,
  UpdateFilmDto,
  AuthResultCode,
  PutReportDto,
} from '../../domain';

import { NestFactory } from '@nestjs/core';
import {FilmModule} from './modules/film.module';
import {UserModule} from './modules/user.module';
import { ReportModule } from './modules/report.module';
import {Command} from './command';
import {Inject, Injectable, Module} from '@nestjs/common';
import * as fs from 'fs';
import {LogModule} from './modules/log.module';
import {BaseException} from '../../exceptions';
import {ILogService, LOG_SERVICE} from '../../service-layer';

@Injectable()
class Main {
  public constructor(
    private readonly filmService: FilmService,
    private readonly authService: AuthService,
    private readonly reportService: ReportService,
    @Inject(REPORT_RATER_SERVICE_TOKEN)
    private readonly reportRaterService: IReportRaterService,
    @Inject(LOG_SERVICE)
    private readonly logService: ILogService,
  ) {}

  private printInstruction(): void {
    const l = console.log;
    l('\n   Меню:');
    l('1. Посмотреть список фильмов');
    l('2. Посмотреть подробную информацию о фильме');
    l('3. Оставить отзыв о фильме (требуется авторизация)');
    l('4. Редактировать описание фильма (требуется авторизация)');
    l('5. Оценить \"тело\" отзыва');
    l('6. Регистрация');
    l('0. Выход');
  }

  private inputNumber(msg?: string): number {
    if (msg)
      console.log(msg);
    const STDIN = 0;
    return parseInt(fs.readFileSync(STDIN).toString());
  }

  private inputString(msg?: string): string {
    if (msg)
      console.log(msg);
    const STDIN = 0;
    return fs.readFileSync(STDIN).toString().replace('\n', '');
  }

  private async registerProcedure(): Promise<AuthResult> {
    console.log('\nРегистрация');
    const login = this.inputString('Введите логин:');
    const password = this.inputString('Введите пароль:');
    return await this.authService.register(login, password);
  }
  private inputLoginAndPassword() {
    console.log('\nАвторизация');
    const login = this.inputString('Введите логин:');
    const password = this.inputString('Введите пароль:');
    return {login, password};
  }

  public async start() {
    let command: Command;

    do {
      this.printInstruction();
      command = this.inputNumber('Введите номер команды: ');

      switch (command) {
        case Command.CheckFilmList: {
          const skip = this.inputNumber('Введите количество фильмов, которое нужно пропустить: ') ?? 0;
          const take = this.inputNumber('Введите количество фильмов, которое нужно взять: ') ?? 10;
          
          await this.logService.info({
            skip, take, command: "Посмотреть список фильмов",
          });
          try {
            const films = await this.filmService.getMany(skip, take);
            console.log('Список фильмов', films);
          } catch (e) {
            await this.logService.danger(e as BaseException);
            console.log('Ошибка', e);
          }
          break;
        }

        case Command.CheckFullFilmInfo: {
          const filmUuid = this.inputString('Введите uuid: ');
          await this.logService.info({
            filmUuid, command: "Посмотреть полную информацию о фильмах"
          });
          try {
            const film = await this
              .filmService
              .getOneWithDetails(filmUuid);
            console.log('Полученный фильм', film);
          } catch (e) {
            await this.logService.danger(e as BaseException);
            console.log('Ошибка', e);
          }
          break;
        }

        case Command.PutReportToFilm: {
          const {login, password} = this.inputLoginAndPassword();

          let plotRate: number;
          let actorPlayRate: number;
          const filmUuid = this.inputString('Введите uuid фильма: ');
          const content = this.inputString('Введите содержимое отзыва');
          const isUserWantsToRateActorPlay = this.inputString('Вы хотите оценить игру актёров? (\'y\' === yes)') === 'y';
          if (isUserWantsToRateActorPlay)
            actorPlayRate = this.inputNumber('Оцените игру актёров: ');
          const isUserWantsToRatePlot = this.inputString('Вы хотите оценить сюжет фильма? (\'y\' === yes)') === 'y';
          if (isUserWantsToRatePlot)
            plotRate = this.inputNumber('Оцените сюжет фильма: '); 

          let dto: PutReportDto = {
            filmUuid,
            content,
          }
          if (isUserWantsToRateActorPlay)
            dto = {...dto, actorPlayRate};
          if (isUserWantsToRatePlot)
            dto = {...dto, plotRate};

          await this.logService.info({
            dto, command: "Оставить отзыв о фильме", 
            login
          });
          try {
            console.log('Оставленный отзыв: ', await this.reportService.put(dto, login, password));
          } catch (e) {
            await this.logService.danger(e as BaseException);
            console.log('Ошибка', e);
          }
          break;
        }

        case Command.ChangeFilmDescription: {
          const {login, password} = this.inputLoginAndPassword();

          const uuid = this.inputString('Введите uuid фильма:');
          const newDescription = this.inputString('Введите новое описание:');

          const dto: UpdateFilmDto = {
            uuid,
            description: newDescription,
          }

          await this.logService.info({
            dto, command: "Изменить описание фильма", 
            login
          });
          try {
            console.log('Изменённый фильм', await this.filmService.update(dto, login, password));
          } catch (e) {
            await this.logService.danger(e as BaseException);
            console.log('Ошибка', e);
          }
          break;
        }
        case Command.RateBody: {
          let plotRate: number;
          let actorPlayRate: number;
          const content = this.inputString('Введите содержимое отзыва: ');
          const isUserWantsToRateActorPlay = this.inputString('Вы хотите оценить игру актёров? (y, n)') === 'y';
          if (isUserWantsToRateActorPlay)
            actorPlayRate = this.inputNumber('Оцените игру актёров: ');
          const isUserWantsToRatePlot = this.inputString('Вы хотите оценить сюжет фильма? (y, n)') === 'y';
          if (isUserWantsToRatePlot)
            plotRate = this.inputNumber('Оцените сюжет фильма: ');
          const body = new RateBody(content, plotRate, actorPlayRate);

          await this.logService.info({
            body, command: "Оценить тело отзыва"
          });
          console.log('Полученная оценка: ', this.reportRaterService.rate(body));
          break;
        }
        case Command.Register: {
          try {
            let user: User;
            const registerRes = await this.registerProcedure();
            await this.logService.info({
              registerRes, 
              command: "Регистрация"
            });
  
            if (registerRes.code === AuthResultCode.Failure) {
              await this.logService.info(null, registerRes.message);
              console.log('Регистрация безуспешна', registerRes.message);
              break;
            }
            user = registerRes.user;
            console.log('Регистрация прошла успешно', user);
          } catch (e) {
            await this.logService.danger(e as BaseException);
            console.log('Ошибка', e);
          }
          break;
        }
        case Command.Exit: {
          console.log("Выход из программы");
          break;
        }
        default:
          await this.logService.info({msg: 'Пользователь выбрал некорректную команду меню'});
          console.log('Введена некорректная команда меню');
          break;
      }
    } while (command !== Command.Exit);
    console.log('Программа остановлена');
    process.exit(0);
  }
}

@Module({
  imports: [
    ReportModule.register('../../configs/report.config.yml'),
    UserModule.register('../../configs/user.config.yml'),
    FilmModule.register('../../configs/film.config.yml'),
    DatabaseModule.register('../../configs/database.config.yml'),
    LogModule.register('../../configs/log.config.yml'),
  ],
  providers: [
    Main,
  ],
})
class MainModule {};

(async () => {
  const app = await NestFactory.createApplicationContext(MainModule);
  const main = app.get(Main);
  await main.start();
})();
