import {
  ReportRaterService, 
  REPORT_CONFIGURATION_TOKEN, 
  REPORT_RATER_SERVICE_TOKEN,
  ReportConfig,
  ReportConfiguration,
  ReportService,
  IReportRaterService
} from '../../../service-layer';
import {
  BaseConfiguration,
  YamlReadStrategy
} from '../../../config';
import {UnknownInstanceException} from '../../../exceptions';
import { ProfanityChecker } from '../../../profanity';

import { DynamicModule, Module, Provider } from '@nestjs/common';
import {DatabaseModule} from '../../../database';
import { UserModule } from './user.module';
import {
  ActorPlayRateOption, 
  ContentLengthRateOption, 
  NoProfanityRateOption, 
  PlotRateOption
} from '../../../domain';
import {LogModule} from './log.module';
import {ReportController} from '../controllers/report.controller';
import {ReportRaterController} from '../controllers';

const reportRaterServiceProvider: Provider<IReportRaterService> = {
  provide: REPORT_RATER_SERVICE_TOKEN,
  useFactory: (
    configuration: BaseConfiguration<ReportConfig>,
  ) => {
    const config = configuration.getConfig();
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
    } = configuration.getConfig();

    const TRIVIAL_RATER_SERVICE_TYPE = 'trivial';

    switch (config.services.raterServiceType) {
      case TRIVIAL_RATER_SERVICE_TYPE:
        return new ReportRaterService(
          configuration,
          [
            new ContentLengthRateOption(contentScores, length),
            new ActorPlayRateOption(actorPlayScores),
            new PlotRateOption(plotScores),
            new NoProfanityRateOption(
              noProfanityScores, 
              profanityWords,
              new ProfanityChecker(),
            )
          ]
        );
      default:
        throw new UnknownInstanceException('invalid rater type');
    }
  },
  inject: [REPORT_CONFIGURATION_TOKEN],
}

@Module({})
export class ReportModule {
  static register(configFilePath: string): DynamicModule {

    const configurationProvider: Provider<BaseConfiguration<ReportConfig>> = {
      provide: REPORT_CONFIGURATION_TOKEN,
      useFactory: () => {
        const conf = new ReportConfiguration(new YamlReadStrategy());
        conf.readConfig(configFilePath);
        return conf;
      }
    };

    return {
      global: true,
      module: ReportModule,
      controllers: [
        ReportController,
        ReportRaterController,
      ],
      imports: [
        LogModule,
        DatabaseModule,
        UserModule,
      ],
      providers: [
        ReportService,
        reportRaterServiceProvider,
        configurationProvider,
      ],
      exports: [
        ReportService,
        REPORT_RATER_SERVICE_TOKEN,
      ]
    }
  }
}
