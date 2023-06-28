import {
  FILM_CONFIGURATION_TOKEN, 
  FilmService,
  AuthService,
  PROFANITY_CHECKER_TOKEN, 
  REPORT_CONFIGURATION_TOKEN,
  PASSWORD_HASH_SERVICE_TOKEN,
  USER_CONFIGURATION_TOKEN,
  PasswordHashService,
  UserConfig,
  FilmConfig,
  ReportConfig,
  FilmConfiguration,
  ReportConfiguration,
  UserConfiguration,
  UserService,
  ERROR_SERVICE,
  LOG_SERVICE,
} from '../../service-layer';
import {
  ProfanityChecker
} from '../../profanity';
import {
  IFilmRepository,
  FILM_REPOSITORY_TOKEN,
  USER_REPOSITORY_TOKEN,
  IUserRepository,
} from '../../repository-contracts';
import {
  FilmTypeormRepository,
  FilmTypeormEntity,
  UserTypeormEntity,
  UserTypeormRepository,
  CompanyTypeormEntity,
  ActorTypeormEntity,
  FilmTypeormEntityMapper,
  ReportTypeormEntity,
  TypeormConfigFactory,
  DatabaseConfig,
  DatabaseConfiguration,
} from '../../database';
import {
  BaseConfiguration,
  YamlReadStrategy
} from '../../config';
import {
  Actor,
  Company,
  Report,
  Film,
  User,
} from '../../domain';
import {
  NotFoundException,
  BaseException,
} from '../../exceptions';

import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {Provider} from '@nestjs/common';
import { createFakeReportByUserAndFilmUuid } from '../unit/report/factories/report.factory';
import {createFakeActor} from '../unit/actor/factories/actor.factory';
import { createFakeCompany } from '../unit/company/factories/company.factory';
import { createFakeFilm } from '../unit/film/factories/film.factory';
import {createArrayWithEmptyElements} from '../utils';
import {createFakeUser} from '../unit/user/factories/user.factory';
import {faker} from '@faker-js/faker';
import { CONNECTION_RESOLVER, ConnectionRefusedResolver } from '../../database';

describe('FilmRepository', () => {

  const databaseConfiguration: BaseConfiguration<DatabaseConfig> = new DatabaseConfiguration(new YamlReadStrategy());
  databaseConfiguration.readConfig('./configs/database.config.yml');

  const filmConfiguration: BaseConfiguration<FilmConfig> = new FilmConfiguration(new YamlReadStrategy());
  filmConfiguration.readConfig('./configs/film.config.yml');

  const userConfiguration: BaseConfiguration<UserConfig> = new UserConfiguration(new YamlReadStrategy());
  userConfiguration.readConfig('./configs/user.config.yml');
  
  const reportConfiguration: BaseConfiguration<ReportConfig> = new ReportConfiguration(new YamlReadStrategy());
  reportConfiguration.readConfig('./configs/report.config.yml');

  let service: FilmService;
  let filmRepository: IFilmRepository;
  let userRepository: IUserRepository;
  let rawFilmRepository: Repository<FilmTypeormEntity>;
  let rawUserRepository: Repository<UserTypeormEntity>;
  let rawReportRepository: Repository<ReportTypeormEntity>;
  let rawCompanyRepository: Repository<CompanyTypeormEntity>;
  let rawActorRepository: Repository<ActorTypeormEntity>;
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = new DataSource(
      TypeormConfigFactory.create(databaseConfiguration.getConfig())
    );
    await dataSource.initialize();
  });

  beforeAll(async () => {
    const filmSub: Provider[] = [
      {
        provide: getRepositoryToken(FilmTypeormEntity, dataSource),
        useFactory: () => new Repository(FilmTypeormEntity, dataSource.manager),
      },
      {
        provide: FILM_REPOSITORY_TOKEN,
        useClass: FilmTypeormRepository,
      },
      {
        provide: FILM_CONFIGURATION_TOKEN,
        useValue: filmConfiguration,
      },
      FilmService,
    ];
    const userSub: Provider[] = [
      {
        provide: getRepositoryToken(UserTypeormEntity, dataSource),
        useFactory: () => new Repository(UserTypeormEntity, dataSource.manager),
      },
      {
        provide: USER_REPOSITORY_TOKEN,
        useClass: UserTypeormRepository,
      },
      {
        provide: PASSWORD_HASH_SERVICE_TOKEN,
        useClass: PasswordHashService,
      },
      {
        provide: USER_CONFIGURATION_TOKEN,
        useValue: userConfiguration
      },
      UserService,
      AuthService,
    ];
    const otherRawReps: Provider[] = [
      {
        provide: getRepositoryToken(CompanyTypeormEntity, dataSource),
        useFactory: () => new Repository(CompanyTypeormEntity, dataSource.manager),
      },
      {
        provide: getRepositoryToken(ActorTypeormEntity, dataSource),
        useFactory: () => new Repository(ActorTypeormEntity, dataSource.manager),
      },
      {
        provide: getRepositoryToken(ReportTypeormEntity, dataSource),
        useFactory: () => new Repository(ReportTypeormEntity, dataSource.manager),
      },
    ];

    const module = await Test.createTestingModule({
      providers: [
        ...filmSub,
        ...userSub,
        ...otherRawReps,
        {
          provide: CONNECTION_RESOLVER,
          useClass: ConnectionRefusedResolver,
        },
        {
          provide: PROFANITY_CHECKER_TOKEN,
          useFactory() {
            return new ProfanityChecker();
          },
          inject: [FILM_CONFIGURATION_TOKEN],
        },
        {
          provide: REPORT_CONFIGURATION_TOKEN,
          useValue: reportConfiguration,
        },
        {
          provide: LOG_SERVICE,
          useValue: {
            warning: jest.fn().mockImplementation(() => {}),
            debug: jest.fn().mockImplementation(() => {}),
          }
        },
        {
          provide: ERROR_SERVICE,
          useValue: {
            async logAndThrowIfConnectionRefused(): Promise<void> {},
            async logAndThrowIfUnknown(): Promise<void> {}
          }
        }
      ],
    }).compile();

    filmRepository = module.get<IFilmRepository>(FILM_REPOSITORY_TOKEN);
    userRepository = module.get<IUserRepository>(USER_REPOSITORY_TOKEN);

    rawFilmRepository = module.get(getRepositoryToken(FilmTypeormEntity, dataSource));
    rawUserRepository = module.get(getRepositoryToken(UserTypeormEntity, dataSource));
    rawCompanyRepository = module.get(getRepositoryToken(CompanyTypeormEntity, dataSource));
    rawReportRepository = module.get(getRepositoryToken(ReportTypeormEntity, dataSource));
    rawActorRepository = module.get(getRepositoryToken(ActorTypeormEntity, dataSource));

    service = module.get(FilmService);
  });

  describe('getOneWithDetails', () => {
    const filmMapper = new FilmTypeormEntityMapper();
    let actors: Actor[];
    let reports: Report[];
    let company: Company;
    let film: Film;
    let user: User;

    let rootEntityWithNestedEntities: FilmTypeormEntity;

    beforeEach(async () => {
      film = createFakeFilm();
      user = createFakeUser();
      actors = createArrayWithEmptyElements(1).map(() => createFakeActor());
      reports = createArrayWithEmptyElements(1).map(() => createFakeReportByUserAndFilmUuid(user, film.uuid));
      company = createFakeCompany();

      film.company = company;
      film.actors = actors;
      film.reports = reports;

      rootEntityWithNestedEntities = filmMapper.toEntity(film);
      await rawFilmRepository.save(rootEntityWithNestedEntities);
    });

    it('founded with all relations', async () => {
      const fullFilm = await service.getOneWithDetails(rootEntityWithNestedEntities.uuid);
      film.reports?.forEach(r => delete (r.user as any).password);
      expect(fullFilm).toEqual(film);
    });
    it('not founded', async () => {
      let exc: BaseException;
      try {
        await service.getOneWithDetails(faker.datatype.string())
      } catch (e) {
        exc = e; 
      }
      expect(exc).toBeDefined();
      expect(exc).toBeInstanceOf(NotFoundException);
    });

    afterEach(async () => {
      await rawUserRepository.query('TRUNCATE \"user\" CASCADE');
      await rawCompanyRepository.query('TRUNCATE company CASCADE');
      await rawFilmRepository.query('TRUNCATE film CASCADE');
      await rawReportRepository.query('TRUNCATE report CASCADE');
      await rawActorRepository.query('TRUNCATE actor CASCADE');
    });
  });

  afterAll(async () => {
    await dataSource.destroy();
  });
});
