import {
  PasswordHashService,
  IPasswordHashService,
  USER_CONFIGURATION_TOKEN
} from '../../../../service-layer';

import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { createHmac } from 'crypto';

describe('PasswordHashService', () => {
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
  let service: IPasswordHashService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PasswordHashService,
        mockedConfigurationProvider,
      ]
    }).compile();

    service = module.get<PasswordHashService>(PasswordHashService);
  });

  describe('encode', () => {
    const alg: string = 'sha256';

    let password: string;
    let secret: string;

    beforeEach(() => {
      password = faker.datatype.string();
      secret = faker.datatype.string();
    });

    it('use', () => {
      expect(service.encode(alg, secret, password))
        .toEqual(createHmac(alg, secret).update(password).digest('hex'));
    });
  });
});
