import {UnknownInstanceException} from '../../../exceptions';
import {
  PASSWORD_HASH_SERVICE_TOKEN, 
  USER_CONFIGURATION_TOKEN,
  IPasswordHashService,
  AuthService,
  UserService,
  PasswordHashService,
  UserConfig,
  UserConfiguration
} from '../../../service-layer';
import {DatabaseModule} from '../../../database';
import {
  BaseConfiguration,
  YamlReadStrategy
} from '../../../config';

import {DynamicModule, FactoryProvider, Provider} from '@nestjs/common';
import {Module} from '@nestjs/common';

const passwordHashServiceProvider: FactoryProvider<IPasswordHashService> = {
  provide: PASSWORD_HASH_SERVICE_TOKEN,
  useFactory: (configuration: BaseConfiguration<UserConfig>) => {
    const {services: {passwordHashServiceType}} = configuration.getConfig();

    const TRIVIAL_PASSWORD_HASH_SERVICE_TYPE = 'trivial';
    switch (passwordHashServiceType) {
      case TRIVIAL_PASSWORD_HASH_SERVICE_TYPE:
        return new PasswordHashService();
      default:
        throw new UnknownInstanceException('unknown password hash type');
    }
  },
  inject: [USER_CONFIGURATION_TOKEN],
}

@Module({})
export class UserModule {
  static register(configFilePath: string): DynamicModule {

    const userConfigurationProvider: Provider<BaseConfiguration<UserConfig>> = {
      provide: USER_CONFIGURATION_TOKEN,
      useFactory() {
        const conf = new UserConfiguration(new YamlReadStrategy());
        conf.readConfig(configFilePath);
        return conf;
      }
    }

    return {
      global: true,
      module: UserModule,
      imports: [
        DatabaseModule
      ],
      providers: [
        AuthService,
        UserService,
        passwordHashServiceProvider,
        userConfigurationProvider,
      ],
      exports: [
        AuthService,
      ]
    }
  }
}
