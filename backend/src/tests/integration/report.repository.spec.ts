import {DataSource, Repository} from "typeorm";
import { Test } from '@nestjs/testing';
import {getRepositoryToken} from "@nestjs/typeorm";
import {createFakeReportByUserAndFilmUuid} from "../unit/report/factories/report.factory";
import { 
  Film,
  User,
  Report,
  CreateReportDto,
  UpdateReportDto,
  ContentLengthRateOption,
  ActorPlayRateOption,
  PlotRateOption,
  NoProfanityRateOption
} from '../../domain';
import { createFakeUser } from '../unit/user/factories/user.factory';
import { createFakeFilm } from '../unit/film/factories/film.factory';
import { faker } from '@faker-js/faker';
import { UnauthorizedException } from '../../exceptions';
import {
  UserConfig,
  ReportConfig,
  ReportConfiguration, 
  UserConfiguration,
  REPORT_CONFIGURATION_TOKEN,
  PASSWORD_HASH_SERVICE_TOKEN, 
  USER_CONFIGURATION_TOKEN,
  ReportRaterService,
  ReportService,
  REPORT_RATER_SERVICE_TOKEN,
  AuthService,
  PasswordHashService,
  FILM_CONFIGURATION_TOKEN,
  FilmConfig,
  UserService,
  ERROR_SERVICE,
  LOG_SERVICE
} from '../../service-layer';
import {
  ProfanityChecker
} from '../../profanity';
import {
  IReportRepository,
  USER_REPOSITORY_TOKEN,
  REPORT_REPOSITORY_TOKEN
} from '../../repository-contracts';
import {
  DatabaseConfiguration,
  DatabaseConfig,
  FilmTypeormEntity,
  ReportTypeormRepository,
  ReportTypeormEntity,
  UserTypeormRepository,
  UserTypeormEntity,
  ReportTypeormEntityMapper,
  CONNECTION_RESOLVER,
  ConnectionRefusedResolver,
} from '../../database';
import {
  YamlReadStrategy,
  BaseConfiguration
} from "../../config";
import {TypeormConfigFactory} from "../../database";
import {Provider} from "@nestjs/common";
import { FilmConfiguration } from '../../service-layer';

describe('ReportRepository', () => {

  const databaseConfiguration: BaseConfiguration<DatabaseConfig> = new DatabaseConfiguration(new YamlReadStrategy());
  databaseConfiguration.readConfig('./configs/database.config.yml');

  const userConfiguration: BaseConfiguration<UserConfig> = new UserConfiguration(new YamlReadStrategy());
  userConfiguration.readConfig('./configs/user.config.yml');
  
  const reportConfiguration: BaseConfiguration<ReportConfig> = new ReportConfiguration(new YamlReadStrategy());
  reportConfiguration.readConfig('./configs/report.config.yml');

  const filmConfiguration: BaseConfiguration<FilmConfig> = new FilmConfiguration(new YamlReadStrategy());
  filmConfiguration.readConfig('./configs/film.config.yml');

  let dataSource: DataSource;
  let reportRepository: IReportRepository;
  let rawReportRepository: Repository<ReportTypeormEntity>;
  let reportRaterService: ReportRaterService;
  let reportService: ReportService;

  let rawUserRepository: Repository<UserTypeormEntity>;
  let passwordHashService: PasswordHashService;

  let rawFilmRepository: Repository<FilmTypeormEntity>;

  beforeAll(async () => {
    dataSource = new DataSource(
      TypeormConfigFactory.create(databaseConfiguration.getConfig())
    );
    await dataSource.initialize();
  });

  beforeAll(async () => {

    const rawReportToken = getRepositoryToken(ReportTypeormEntity, dataSource);
    const repSub: Provider<any>[] = [
      {
        provide: rawReportToken,
        useFactory: () => new Repository(ReportTypeormEntity, dataSource.manager),
      },
      {
        provide: REPORT_REPOSITORY_TOKEN,
        useClass: ReportTypeormRepository,
      },
      {
        provide: REPORT_RATER_SERVICE_TOKEN,
        useFactory: (conf: BaseConfiguration<ReportConfig>) => {
          const {
            content: {
              payload: {length}, 
              givingScores: contentScores,
            },
            plotRate: {givingScores: plotScores},
            actorPlayRate: {givingScores: actorPlayScores},
            noProfanity: {givingScores: noProfanityScores},
            profanity: {
              list: profanityWords
            },
          } = conf.getConfig();

          return new ReportRaterService(
            conf,
            [
              new ContentLengthRateOption(contentScores, length),
              new ActorPlayRateOption(actorPlayScores),
              new PlotRateOption(plotScores),
              new NoProfanityRateOption(
                noProfanityScores, 
                profanityWords,
                new ProfanityChecker()
              ),
            ]
          );
        },
        inject: [REPORT_CONFIGURATION_TOKEN]
      },
      {
        provide: CONNECTION_RESOLVER,
        useClass: ConnectionRefusedResolver,
      },
      {
        provide: LOG_SERVICE,
        useValue: {
          debug() {},
          warning() {}
        }
      },
      {
        provide: FILM_CONFIGURATION_TOKEN,
        useValue: filmConfiguration,
      },
      {
        provide: REPORT_CONFIGURATION_TOKEN,
        useValue: reportConfiguration,
      },
      {
        provide: ERROR_SERVICE,
        useValue: {
          async logAndThrowIfConnectionRefused(): Promise<void> {},
          async logAndThrowIfUnknown(): Promise<void> {},
        }
      },
      ReportService,
    ];

    const rawUserToken = getRepositoryToken(UserTypeormEntity, dataSource);
    const userSub: Provider<any>[] = [
      {
        provide: PASSWORD_HASH_SERVICE_TOKEN,
        useClass: PasswordHashService,
      },
      {
        provide: USER_REPOSITORY_TOKEN,
        useClass: UserTypeormRepository,
      },
      {
        provide: rawUserToken,
        useFactory: () => new Repository(UserTypeormEntity, dataSource.manager),
      },
      {
        provide: USER_CONFIGURATION_TOKEN,
        useValue: userConfiguration,
      },
      UserService,
      AuthService,
    ]

    const module = await Test.createTestingModule({
      providers: [
        ...userSub,
        ...repSub,
        {
          provide: getRepositoryToken(FilmTypeormEntity, dataSource),
          useFactory: () => new Repository(FilmTypeormEntity, dataSource.manager),
        },
      ],
    }).compile();

    reportRepository = module.get<IReportRepository>(REPORT_REPOSITORY_TOKEN);
    rawReportRepository = module.get<Repository<ReportTypeormEntity>>(rawReportToken);
    rawUserRepository = module.get<Repository<UserTypeormEntity>>(rawUserToken);
    passwordHashService = module.get<PasswordHashService>(PASSWORD_HASH_SERVICE_TOKEN);
    reportRaterService = module.get<ReportRaterService>(REPORT_RATER_SERVICE_TOKEN);
    reportService = module.get(ReportService);
    rawFilmRepository = module.get<Repository<FilmTypeormEntity>>(getRepositoryToken(FilmTypeormEntity, dataSource));
  });

  describe('create', () => {

    let passwordBeforeHashing: string;
    let report: Report;
    let film: Film;
    let user: User;
    let dto: CreateReportDto;
    let rawRepSpy: jest.SpyInstance, repSpy: jest.SpyInstance;

    beforeEach(async () => {
      user = createFakeUser();
      passwordBeforeHashing = user.password;
      user.password = passwordHashService.encode(
        userConfiguration.getConfig().hash.alg,
        userConfiguration.getConfig().hash.secret,
        user.password,
      );
      film = createFakeFilm();
      report = createFakeReportByUserAndFilmUuid(user, film.uuid);
      dto = {
        userUuid: report.userUuid,
        filmUuid: report.filmUuid,
        content: faker.datatype.string(),
      };

      await rawUserRepository.save(user);
      await rawFilmRepository.save(film);
      user.password = passwordBeforeHashing;
    });

    it('successful create', async () => {
      rawRepSpy = jest.spyOn(rawReportRepository, 'insert');
      repSpy = jest.spyOn(reportRepository, 'save');

      const createdReport = await reportService.put(dto, user.login, user.password);

      expect(createdReport.uuid).toBeDefined();
      expect(createdReport.userUuid).toBe(dto.userUuid);
      expect(createdReport.filmUuid).toBe(dto.filmUuid);
      expect(createdReport.content).toBe(dto.content);

      expect(rawRepSpy).toBeCalledTimes(1);
      expect(repSpy).toBeCalledTimes(1);
    });
    it('creating entity with not existing userUuid in db', async () => {
      const mapper = new ReportTypeormEntityMapper();
      rawRepSpy = jest.spyOn(rawReportRepository, 'insert');
      repSpy = jest.spyOn(reportRepository, 'save');

      await rawReportRepository.save(mapper.toEntity(report));
      dto.userUuid = faker.datatype.uuid();

      try {
        await reportService.put(dto, user.login, user.password)
      } catch (e) {
        expect(e).toBeDefined();
      }
      expect(repSpy).toBeCalledTimes(0);
      expect(rawRepSpy).toBeCalledTimes(0);
    });
    it('creating entity with not existing filmUuid in db', async () => {
      const mapper = new ReportTypeormEntityMapper();
      rawRepSpy = jest.spyOn(rawReportRepository, 'insert');
      repSpy = jest.spyOn(reportRepository, 'save');

      await rawReportRepository.save(mapper.toEntity(report));
      dto.filmUuid = faker.datatype.uuid();

      try {
        await reportService.put(dto, user.login, user.password)
      } catch (e) {
        expect(e).toBeDefined();
      }
      expect(repSpy).toBeCalledTimes(0);
      expect(rawRepSpy).toBeCalledTimes(0);
    });

    afterEach(async () => {
      rawRepSpy.mockClear();
      repSpy.mockClear();

      await rawReportRepository.query('TRUNCATE report CASCADE');
      await rawUserRepository.query('TRUNCATE \"user\" CASCADE');
      await rawFilmRepository.query('TRUNCATE film CASCADE');
    });
  });

  describe('update', () => {
    let userConfig: UserConfig;
    let report: Report;
    let dto: UpdateReportDto;
    let content: string;
    let film: Film;
    let user: User;
    let rawRepUpdateSpy: jest.SpyInstance, repSpy: jest.SpyInstance, rawRepFindSpy: jest.SpyInstance;
    let newActorPlayRate: number;
    let newPlotRate: number;

    beforeEach(async () => {
      userConfig = userConfiguration.getConfig();

      user = createFakeUser();
      film = createFakeFilm();

      report = createFakeReportByUserAndFilmUuid(user, film.uuid);
      report.rate = reportRaterService.rate(report).rating;
      content = faker.datatype.string();
      newActorPlayRate = faker.datatype.number({min: 3, max: 10});
      newPlotRate = faker.datatype.number({min: 3, max: 10});
      report.content = content;
      report.actorPlayRate = newActorPlayRate;
      report.plotRate = newPlotRate;

      dto = {
        uuid: report.uuid,
        content,
        userUuid: report.userUuid,
        filmUuid: report.filmUuid,
        actorPlayRate: newActorPlayRate,
        plotRate: newPlotRate,
      };

      const prev = user.password;
      user.password = passwordHashService.encode(
        userConfig.hash.alg,
        userConfig.hash.secret,
        user.password
      );
      await rawUserRepository.save(user);
      user.password = prev;
      await rawFilmRepository.save(film);
      delete report.user;
      await rawReportRepository.save(report);
    });

    it('successful update', async () => {
      rawRepUpdateSpy = jest.spyOn(rawReportRepository, 'update');
      rawRepFindSpy = jest.spyOn(rawReportRepository, 'findOneBy');
      repSpy = jest.spyOn(reportRepository, 'update');

      const res = await reportService.put(dto, user.login, user.password);

      expect(res).toBeDefined();
      expect(res.uuid).toEqual(report.uuid);
      expect(res.content).toEqual(report.content);
      expect(rawRepFindSpy).toBeCalledTimes(3);
      expect(repSpy).toBeCalledTimes(1);
      expect(rawRepUpdateSpy).toBeCalledTimes(1);
    });
    it('updating entity with not existing uuid in db', async () => {
      let exc;
      rawRepUpdateSpy = jest.spyOn(rawReportRepository, 'update');
      rawRepFindSpy = jest.spyOn(rawReportRepository, 'findOneBy');
      repSpy = jest.spyOn(reportRepository, 'update');

      try {
        await reportService.put(dto, faker.datatype.string(), faker.datatype.string());
      } catch (e) {
        exc = e;
      }
      expect(exc).toBeDefined();
      expect(exc).toBeInstanceOf(UnauthorizedException);
    });
    afterEach(async () => {
      rawRepUpdateSpy.mockClear();
      rawRepFindSpy.mockClear();
      repSpy.mockClear();

      await rawFilmRepository.query('TRUNCATE film CASCADE');
      await rawUserRepository.query('TRUNCATE \"user\" CASCADE');
      await rawReportRepository.query('TRUNCATE report CASCADE');
    });
  });

  afterAll(async () => {
    await dataSource.destroy();
  });
});
