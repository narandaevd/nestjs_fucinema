import {
  USER_REPOSITORY_TOKEN, 
} from '../../../../repository-contracts';
import {
  AuthResultCode,
  AuthResult, 
  User
} from '../../../../domain';
import { Test } from '@nestjs/testing';
import { createFakeUser } from '../factories/user.factory';
import { faker } from '@faker-js/faker';
import {
  AuthService, 
  ERROR_SERVICE, 
  IErrorService, 
  PASSWORD_HASH_SERVICE_TOKEN, 
  USER_CONFIGURATION_TOKEN, 
  UserService,
  LOG_SERVICE
} from '../../../../service-layer';
import {Provider} from '@nestjs/common';
import { NotUniqueInstanceException } from '../../../../exceptions';

describe('AuthService', () => {

  const mockedPasswordHasher = {
    provide: PASSWORD_HASH_SERVICE_TOKEN,
    useValue: {
      encode: jest.fn(),
    }
  };
  const mockedLogService = {
    provide: LOG_SERVICE,
    useValue: {
      debug: jest.fn().mockImplementation(() => {}),
      info: jest.fn().mockImplementation(() => {}),
    }
  }
  const mockedErrorService: Provider<IErrorService> = {
    provide: ERROR_SERVICE,
    useValue: {
      async logAndThrowIfConnectionRefused(): Promise<void> {},
      async logAndThrowIfUnknown(): Promise<void> {}
    }
  }
  const mockedUserRepository = {
    provide: USER_REPOSITORY_TOKEN,
    useValue: {
      save: jest.fn(),
      findOneByLogin: jest.fn(),
    }
  };
  const mockedUserServiceProvider = {
    provide: UserService,
    useValue: {
      create: jest.fn(),
    }
  }
  const mockedConfigurationProvider = {
    provide: USER_CONFIGURATION_TOKEN,
    useValue: {
      getConfig() {
        return {
          services: {
            passwordHashServiceType: 'trivial'
          },
          hash: {
            alg: 'sha256',
            secret: 'some-secret',
          }
        }
      }
    }
  };
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test
      .createTestingModule({
        providers: [
          AuthService,
          mockedPasswordHasher,
          mockedUserRepository,
          mockedConfigurationProvider,
          mockedUserServiceProvider,
          mockedLogService,
          mockedErrorService
        ]
      })
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    let user: User;
    let password: string; 
    let login: string;
    let msg: string;

    beforeEach(() => {
      user = createFakeUser();
      password = user.password;
      login = user.login;
      msg = faker.datatype.string();
    });

    it('found and corrent password', async () => {
      const user = new User(login, password);
      mockedPasswordHasher
        .useValue
        .encode
        .mockReturnValueOnce(password);
      mockedUserRepository
        .useValue
        .findOneByLogin
        .mockResolvedValueOnce(user);

      const res = await service.login(login, password);
      const expected = new AuthResult(AuthResultCode.Success, msg, user);

      expect(res.code).toEqual(expected.code);
      expect(res.user).toEqual(expected.user);
    });
    it('found but incorrent password', async () => {
      mockedPasswordHasher
        .useValue
        .encode
        .mockReturnValueOnce(password);
      mockedUserRepository
        .useValue
        .findOneByLogin
        .mockResolvedValueOnce(new User(login, password + faker.datatype.string()));

      const res = await service.login(login, password);
      const expected = new AuthResult(AuthResultCode.Failure, msg);

      expect(res.code).toEqual(expected.code);
      expect(res.user).toEqual(expected.user);
    });
    it('user not found', async () => {
      mockedPasswordHasher
        .useValue
        .encode
        .mockReturnValueOnce(password);
      mockedUserRepository
        .useValue
        .findOneByLogin
        .mockResolvedValueOnce(null);

      const res = await service.login(login, password);
      const expected = new AuthResult(AuthResultCode.Failure, msg);

      expect(res.code).toEqual(expected.code);
      expect(res.user).toEqual(expected.user);
    });
  });

  describe('register', () => {
    let user: User;
    let password: string; 
    let login: string;
    let msg: string;

    beforeEach(() => {
      user = createFakeUser();
      password = user.password;
      login = user.login;
      msg = faker.datatype.string();
    });

    it('successfully registered', async () => {
      mockedUserServiceProvider
        .useValue
        .create
        .mockImplementationOnce(async () => user);

      const res = await service.register(login, password);
      const expected = new AuthResult(AuthResultCode.Success, msg, res.user);

      expect(res.code).toEqual(expected.code);
      expect(res.user).toEqual(expected.user);
    });
    it('user with this login already exists', async () => {
      mockedUserServiceProvider
        .useValue
        .create
        .mockImplementationOnce(async () => null);

      let exc: any;
      try {
        await service.register(login, password);
      } catch (e) {
        exc = e;
      }
      expect(exc).toBeInstanceOf(NotUniqueInstanceException);
    });
  });
});
