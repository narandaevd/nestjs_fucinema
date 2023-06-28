import {DatabaseModule} from '../../../database';
import {ProfanityChecker} from '../../../profanity';
import {IProfanityChecker} from '../../../domain';

import { DynamicModule, Module, Provider } from '@nestjs/common';
import {ReportModule} from './report.module';
import {
  FilmService,
  FilmConfiguration,
  FILM_CONFIGURATION_TOKEN,
  FilmConfig,
  PROFANITY_CHECKER_TOKEN,
} from '../../../service-layer';
import {
  BaseConfiguration,
  YamlReadStrategy
} from '../../../config';

import { UserModule } from './user.module';
import {UnknownInstanceException} from '../../../exceptions';
import {LogModule} from './log.module';

const profanityServiceProvider: Provider<IProfanityChecker> = {
  provide: PROFANITY_CHECKER_TOKEN,
  useFactory: (configuration: BaseConfiguration<FilmConfig>) => {
    const config = configuration.getConfig();

    const TRIVIAL_PROFANITY_SERVICE_TYPE = 'trivial';
    switch (config.services.profanityServiceType) {
      case TRIVIAL_PROFANITY_SERVICE_TYPE:
        return new ProfanityChecker();
      default:
        throw new UnknownInstanceException('invalid profanity type');
    }
  },
  inject: [FILM_CONFIGURATION_TOKEN]
}

@Module({})
export class FilmModule {
  static register(configFilePath: string): DynamicModule {

    const configurationProvider: Provider<BaseConfiguration<FilmConfig>> = {
      provide: FILM_CONFIGURATION_TOKEN,
      useFactory() {
        const conf = new FilmConfiguration(new YamlReadStrategy());
        conf.readConfig(configFilePath);
        return conf;
      }
    };

    return {
      global: true,
      module: FilmModule,
      imports: [
        DatabaseModule,
        ReportModule,
        UserModule,
        LogModule,
      ],
      providers: [
        FilmService,
        profanityServiceProvider,
        configurationProvider,
      ],
      exports: [
        FilmService,
      ]
    }
  }
}
