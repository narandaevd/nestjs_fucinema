import {User} from '../../../../domain';
import {
  UserService,
  USER_CONFIGURATION_TOKEN,
  PASSWORD_HASH_SERVICE_TOKEN,
  ERROR_SERVICE,
  IErrorService
} from '../../../../service-layer';
import {USER_REPOSITORY_TOKEN} from '../../../../repository-contracts';

import { createFakeUser } from '../factories/user.factory';
import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import {Provider} from '@nestjs/common';

describe('UserService', () => {
  const mockedUserRepository = {
    provide: USER_REPOSITORY_TOKEN,
    useValue: {
      save: jest.fn(),
      findOneByLogin: jest.fn(),
    }
  }
  const mockedPasswordHashServiceProvider = {
    provide: PASSWORD_HASH_SERVICE_TOKEN,
    useValue: {
      encode: jest.fn()
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
  const mockedErrorService: Provider<IErrorService> = {
    provide: ERROR_SERVICE,
    useValue: {
      async logAndThrowIfConnectionRefused(): Promise<void> {},
      async logAndThrowIfUnknown(): Promise<void> {}
    }
  }
  let service: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        mockedConfigurationProvider,
        mockedUserRepository,
        mockedPasswordHashServiceProvider,
        mockedErrorService
      ]
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('create', () => {
    let login: string;
    let password: string;
    let user: User;

    beforeEach(() => {
      login = faker.internet.userName();
      password = faker.internet.password();
      user = createFakeUser();
    });

    it('successful creating', async () => {
      mockedUserRepository
        .useValue
        .save
        .mockImplementationOnce(async () => user);
      mockedUserRepository
        .useValue
        .findOneByLogin
        .mockResolvedValueOnce(null);
      mockedPasswordHashServiceProvider
        .useValue
        .encode
        .mockImplementationOnce(() => password);

      expect(await service.create(login, password))
        .toEqual(user);
    });
    it('throw not_unique', async () => {
      mockedUserRepository
        .useValue
        .save
        .mockImplementationOnce(async () => user);
      mockedUserRepository
        .useValue
        .findOneByLogin
        .mockImplementationOnce(() => {
          return user;
        });

      const result = await service.create(login, password);
      expect(result).toBe(null);
    });
  });
});
