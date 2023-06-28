import {
  FILM_REPOSITORY_TOKEN
} from "../../../../repository-contracts";
import {
  Film,
  UpdateFilmDto,
  AuthResultCode,
  AuthResult,
  User
} from "../../../../domain";
import {createFakeFilm} from "../factories/film.factory";
import {
  AuthService,
  PROFANITY_CHECKER_TOKEN,
  FILM_CONFIGURATION_TOKEN,
  FilmService,
  FilmConfig,
  IErrorService,
  ERROR_SERVICE,
  LOG_SERVICE
} from "../../../../service-layer";
import { 
  NotFoundException, 
  UnauthorizedException,
  ProfanityException
} from '../../../../exceptions';

import {Test} from "@nestjs/testing";
import { faker } from '@faker-js/faker';
import {createFakeUser} from "../../user/factories/user.factory";
import {Provider} from "@nestjs/common";

describe('FilmService', () => {

  const mockedRepository = {
    provide: FILM_REPOSITORY_TOKEN,
    useValue: {
      findManyAndTotalCount: jest.fn(),
      update: jest.fn(),
      getOneWithDetails: jest.fn(),
    },
  };
  const mockedConnectionRefusedLoggerService: Provider<IErrorService> = {
    provide: ERROR_SERVICE,
    useValue: {
      async logAndThrowIfConnectionRefused(): Promise<void> {},
      async logAndThrowIfUnknown(): Promise<void> {},
    }
  }
  const mockedLogService = {
    provide: LOG_SERVICE,
    useValue: {
      warning: jest.fn().mockImplementation(() => {}),
      debug: jest.fn().mockImplementation(() => {}),
    }
  }
  const mockedAuthService = {
    provide: AuthService,
    useValue: {
      login: jest.fn(),
    }
  };
  const mockedProfanityService = {
    provide: PROFANITY_CHECKER_TOKEN,
    useValue: {
      isContainsAnyProfanityWord: jest.fn(),
    }
  };
  const mockedConfiguration = {
    provide: FILM_CONFIGURATION_TOKEN,
    useValue: {
      getConfig(): FilmConfig {
        return {
          defaultSkip: 0,
          defaultTake: 10,
          profanity: {
            list: ['дурак', 'идиот']
          },
          services: {
            profanityServiceType: 'trivial',
          }
        }
      }
    }
  }
  let service: FilmService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FilmService,
        mockedRepository,
        mockedAuthService,
        mockedProfanityService,
        mockedConfiguration,
        mockedConnectionRefusedLoggerService,
        mockedLogService
      ]
    }).compile();

    service = module.get<FilmService>(FilmService);
  });

  describe('getMany', () => {

    let films: Film[] = [];

    it('get all', async () => {
      for (let i = 0; i < 3; i++)
        films.push(createFakeFilm());

      mockedRepository
        .useValue
        .findManyAndTotalCount
        .mockResolvedValueOnce(films);
      
      expect(await service.getMany()).toEqual(films);
    });
  });

  describe('getOneWithDefails', () => {

    let uuidForGet: string;
    let expectedFilm: Film;

    beforeEach(() => {
      uuidForGet = faker.datatype.uuid();
      expectedFilm = createFakeFilm({
        actors: true,
        company: true,
        reports: {
          user: true,
        }
      });
    });

    it('get one with id check', async () => {
      mockedRepository
        .useValue
        .getOneWithDetails
        .mockImplementationOnce(async (uuid: string) => {
          return (uuid === uuidForGet) ? expectedFilm : createFakeFilm();
        });

      expect(await service.getOneWithDetails(uuidForGet)).toEqual(expectedFilm);
    });
  });

  describe('update', () => {
    let uuidForUpdate: string;
    let dto: UpdateFilmDto;
    let expectedFilm: Film;
    let login: string;
    let password: string;
    let user: User;
    let successfulLoginMessage: string;

    beforeEach(() => {
      expectedFilm = createFakeFilm({
        actors: true,
        company: true,
        reports: {
          user: true,
        }
      });
      user = createFakeUser();
      uuidForUpdate = expectedFilm.uuid;
      dto = {uuid: uuidForUpdate, description: faker.datatype.string()};
      login = user.login;
      password = user.password;
      successfulLoginMessage = faker.datatype.string();
    });

    it('update with id check', async () => {
      mockedRepository
        .useValue
        .update
        .mockImplementationOnce(async (dto: UpdateFilmDto) => {
          return (dto.uuid === uuidForUpdate) 
            ? expectedFilm 
            : createFakeFilm();
        });
      mockedAuthService
        .useValue
        .login
        .mockResolvedValueOnce(new AuthResult(
          AuthResultCode.Success, 
          successfulLoginMessage,
          user
        ));

      expect(await service.update(dto, login, password))
        .toEqual(expectedFilm);
    });
    it('update with profanity in descrption', async () => {
      mockedProfanityService
        .useValue
        .isContainsAnyProfanityWord
        .mockReturnValueOnce(true);
      mockedAuthService
        .useValue
        .login
        .mockResolvedValueOnce(new AuthResult(
          AuthResultCode.Success, 
          successfulLoginMessage,
          user
        ));

      try {
        await service.update(dto, login, password);
      } catch (e) {
        expect(e).toBeInstanceOf(ProfanityException);
      }
    });
    it('update with unauthorized', async () => {
      mockedAuthService
        .useValue
        .login
        .mockResolvedValueOnce(new AuthResult(AuthResultCode.Failure));

      try {
        await service.update(dto, login, password);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
      }
    });
    it('update with unexistable instance (uuid)', async () => {
      let exc;
      mockedAuthService
        .useValue
        .login
        .mockResolvedValueOnce(new AuthResult(
          AuthResultCode.Success, 
          successfulLoginMessage,
          user
        ));

      mockedProfanityService
        .useValue
        .isContainsAnyProfanityWord
        .mockReturnValueOnce(false);
      mockedRepository
        .useValue
        .update
        .mockImplementationOnce(() => null);

      try {
        await service.update(dto, login, password);
      } catch (e) {
        exc = e;
      }
      expect(exc).toBeInstanceOf(NotFoundException);
    });
  });
});
