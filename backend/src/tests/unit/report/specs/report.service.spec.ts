import {
  User,
  Report,
  ReportFactory,
  CreateReportDto,
  UpdateReportDto,
  AuthResult,
  AuthResultCode,
} from "../../../../domain";
import {
  ReportService,
  REPORT_CONFIGURATION_TOKEN,
  REPORT_RATER_SERVICE_TOKEN,
  ReportConfig,
  AuthService,
  ERROR_SERVICE,
  IErrorService,
  LOG_SERVICE
} from "../../../../service-layer";
import {
  REPORT_REPOSITORY_TOKEN
} from "../../../../repository-contracts";
import {BaseConfiguration} from "../../../../config";
import {UnauthorizedException} from '../../../../exceptions';

import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import {Provider} from "@nestjs/common";
import {createFakeUser} from "../../user/factories/user.factory";

describe('ReportService', () => {

  const uuidAfterCreating: string = faker.datatype.uuid();
  const ratingAfterCreatingAndUpdating = faker.datatype.number();
  const mockedRepository = {
    provide: REPORT_REPOSITORY_TOKEN,
    useValue: {
      save: jest.fn(),
      update: jest.fn(),
      findOneByUserAndFilm: jest.fn(),
    }
  };
  const mockedLogService = {
    provide: LOG_SERVICE,
    useValue: {
      debug: jest.fn().mockImplementation(() => {}),
      warning: jest.fn().mockImplementation(() => {}),
    }
  }
  const reportConfiguration = {
    provide: REPORT_CONFIGURATION_TOKEN,
    useValue: {
      getConfig() {
        return {
          defaultValue: 0,
          maxRating: 100,
          plotRate: {givingScores: 25},
          actorPlayRate: {givingScores: 25},
          noProfanity: {givingScores: 25},
          content: {
            givingScores: 25,
            payload: {length: 2000},
          },
          profanity: {
            list: ['дурак', 'идиот'],
          },
          services: {
            profanityServiceType: 'trivial',
            raterServiceType: 'trivial'
          }
        }
      }
    }
  }
  const mockedErrorService: Provider<IErrorService> = {
    provide: ERROR_SERVICE,
    useValue: {
      async logAndThrowIfConnectionRefused(): Promise<void> {},
      async logAndThrowIfUnknown(): Promise<void> {}
    }
  }
  const mockedReportRater: Provider = {
    provide: REPORT_RATER_SERVICE_TOKEN,
    useFactory: (conf: BaseConfiguration<ReportConfig>) => {
      const maxRating = [
        conf.getConfig().actorPlayRate.givingScores,
        conf.getConfig().plotRate.givingScores,
        conf.getConfig().content.givingScores,
        conf.getConfig().noProfanity.givingScores,
      ].reduce((s, v) => s + v, 0);

      return {
        rate: () => {
          return {
            rating: ratingAfterCreatingAndUpdating,
            maxRating,
          }
        }
      };
    },
    inject: [REPORT_CONFIGURATION_TOKEN],
  };
  const mockedAuthService = {
    provide: AuthService,
    useValue: {
      login: jest.fn(),
    }
  };
  let service: ReportService;
  let createSpy: jest.SpyInstance;
  let updateSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ReportService,
        mockedRepository,
        mockedReportRater,
        mockedAuthService,
        mockedLogService,
        mockedErrorService,
        reportConfiguration,
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);

    createSpy = jest.spyOn((service as any), 'create');
    createSpy.mockClear();
    updateSpy = jest.spyOn((service as any), 'update');
    updateSpy.mockClear();
  });

  describe('put (create)', () => {
    let content: string;
    let filmUuid: string;
    let userUuid: string;
    let user: User;

    beforeEach(() => {
      user = createFakeUser();
      content = faker.datatype.string();
      filmUuid = faker.datatype.uuid();
      userUuid = user.uuid;

      mockedRepository
        .useValue
        .save
        .mockImplementation(async (r: Report) => r);
      mockedRepository
        .useValue
        .findOneByUserAndFilm
        .mockResolvedValue(null);
      jest
        .spyOn(ReportFactory, 'createFromDto')
        .mockImplementation((dto: CreateReportDto) => {
          return {
            uuid: uuidAfterCreating,
            ...dto,
          }
        });
    });

    it('authorized', async () => {
      mockedAuthService
        .useValue
        .login
        .mockResolvedValueOnce(new AuthResult(AuthResultCode.Success, 'success', user));
      const dto: CreateReportDto = {
        content,
        filmUuid,
        userUuid: user.uuid,
        plotRate: faker.datatype.number(),
        actorPlayRate: faker.datatype.number(),
      };
      const expectedRes: Report = {
        uuid: uuidAfterCreating,
        rate: ratingAfterCreatingAndUpdating,
        ...dto,
      };

      expect(await service.put(
        dto,
        faker.internet.userName(), 
        faker.internet.password()
      )).toEqual(expectedRes);
      expect(createSpy).toBeCalledTimes(1);
      expect(createSpy).toBeCalled();
      expect(updateSpy).toBeCalledTimes(0);
      expect(updateSpy).not.toBeCalled();
    });

    it('not authorized', async () => {
      mockedAuthService
        .useValue
        .login
        .mockResolvedValueOnce(new AuthResult(AuthResultCode.Failure));
      const dto: CreateReportDto = {
        content,
        filmUuid,
        userUuid,
      };

      try {
        await service.put(dto, user.login, user.password);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      } 
      expect(createSpy).toBeCalledTimes(0);
      expect(createSpy).not.toBeCalled();
      expect(updateSpy).toBeCalledTimes(0);
      expect(updateSpy).not.toBeCalled();
    });
  });

  describe('put (update)', () => {
    let content: string;
    let userUuid: string;
    let filmUuid: string;
    let login: string;
    let password: string;
    let uuidForUpdate: string;

    beforeEach(() => {
      login = faker.datatype.string();
      password = faker.datatype.string();
      uuidForUpdate = faker.datatype.uuid();
      content = faker.random.locale();
      userUuid = faker.datatype.uuid();
      filmUuid = faker.datatype.uuid();

      mockedRepository
        .useValue
        .update
        .mockImplementationOnce(async (dto: UpdateReportDto) => {
          const r: Report = {
            ...dto,
            content: dto.content || content,
          };
          return r;
        });
    });

    it('set content', async () => {
      const dto: UpdateReportDto = {
        uuid: uuidForUpdate, 
        userUuid,
        content,
        plotRate: faker.datatype.number(),
        actorPlayRate: faker.datatype.number(),
        rate: ratingAfterCreatingAndUpdating,
      };
      const expected: Report = {
        uuid: uuidForUpdate,
        ...dto,
        content, 
        rate: ratingAfterCreatingAndUpdating,
      };
      mockedAuthService
        .useValue
        .login
        .mockResolvedValueOnce(new AuthResult(
          AuthResultCode.Success,
          'success',
          {
            uuid: userUuid,
          } as User,
        ));
      mockedRepository
        .useValue
        .findOneByUserAndFilm
        .mockResolvedValueOnce(expected);

      expect(await service.put(dto, login, password))
        .toEqual(expected);
      expect(createSpy).toBeCalledTimes(0);
      expect(createSpy).not.toBeCalled();
      expect(updateSpy).toBeCalledTimes(1);
      expect(updateSpy).toBeCalled();
    });
    it('unauthorized', async () => {
      const dto: UpdateReportDto = {uuid: uuidForUpdate, filmUuid, userUuid};

      mockedAuthService
        .useValue
        .login
        .mockResolvedValueOnce(new AuthResult(AuthResultCode.Failure));
      try {
        await service.put(dto, login, password);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }
      expect(createSpy).toBeCalledTimes(0);
      expect(createSpy).not.toBeCalled();
      expect(updateSpy).toBeCalledTimes(0);
      expect(updateSpy).not.toBeCalled();
    });
  });
});
