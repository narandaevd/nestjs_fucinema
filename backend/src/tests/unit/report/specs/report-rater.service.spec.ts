import {
  ActorPlayRateOption,
  ContentLengthRateOption,
  NoProfanityRateOption,
  PlotRateOption,
  RateBody, 
  RateResult,
  Report
} from '../../../../domain';
import {
  ReportRaterService,
  REPORT_CONFIGURATION_TOKEN,
  IReportRaterService,
  ReportConfig,
  LOG_SERVICE
} from '../../../../service-layer';
import {UnknownInstanceException} from '../../../../exceptions';
import {BaseConfiguration} from '../../../../config';
import { ProfanityChecker } from '../../../../profanity';

import { Test } from '@nestjs/testing';
import { createFakeReport } from '../factories/report.factory';
import { faker } from '@faker-js/faker';

describe('ReportRaterService', () => {

  const conf = {
    provide: REPORT_CONFIGURATION_TOKEN,
    useValue: {
      getConfig(): ReportConfig {
        return {
          defaultValue: 0,
          plotRate: {givingScores: 25, payload: {}},
          actorPlayRate: {givingScores: 25, payload: {}},
          noProfanity: {givingScores: 25, payload: {}},
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
  let service: IReportRaterService;
  let configuration: BaseConfiguration<ReportConfig>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: ReportRaterService,
          useFactory(configuration: BaseConfiguration<ReportConfig>) {
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
            
            return new ReportRaterService(configuration, [
              new ContentLengthRateOption(contentScores, length),
              new ActorPlayRateOption(actorPlayScores),
              new PlotRateOption(plotScores),
              new NoProfanityRateOption(
                noProfanityScores, 
                profanityWords,
                new ProfanityChecker()
              ),
            ]);
          },
          inject: [REPORT_CONFIGURATION_TOKEN]
        },
        conf
      ]
    }).compile();

    service = module.get(ReportRaterService);
    configuration = module.get(REPORT_CONFIGURATION_TOKEN);
  });

  describe('rate', () => {
    let body: RateBody;
    let reportWithAllProps: Report;
    let reportWithOnlyRequiredProps: Report;
    let config: ReportConfig;
    let maxRating: number;

    beforeEach(() => {
      reportWithAllProps = createFakeReport('full');
      reportWithOnlyRequiredProps = createFakeReport('only-required');
      config = configuration.getConfig();

      maxRating = [
        configuration.getConfig().actorPlayRate.givingScores,
        configuration.getConfig().plotRate.givingScores,
        configuration.getConfig().content.givingScores,
        configuration.getConfig().noProfanity.givingScores,
      ].reduce((s, v) => s + v, 0);
    });

    it('rate body', () => {
      body = new RateBody(faker.datatype.string(5));

      const rating = service.rate(body).rating;

      expect(rating).toBe(
        config.defaultValue + config.noProfanity.givingScores
      );
    });
    it('rate for 100', () => {
      reportWithAllProps.content = faker.random.numeric(
        config.content.payload.length + 2
      );

      const rating = service.rate(reportWithAllProps).rating;

      expect(rating).toBe(maxRating);
    });
    it('rate for 75', () => {
      reportWithAllProps.content = faker.random.numeric(
        config.content.payload.length - 2
      );
      const rating = service.rate(reportWithAllProps).rating;
      
      expect(rating).toBe(
        config.defaultValue + 
        config.plotRate.givingScores +
        config.actorPlayRate.givingScores +
        config.noProfanity.givingScores
      );
    });
    it('rate for 50', () => {
      reportWithAllProps.content = faker.helpers.arrayElement(config.profanity.list);

      const rating = service.rate(reportWithAllProps).rating;
      
      expect(reportWithAllProps.actorPlayRate).toBeDefined();
      expect(reportWithAllProps.plotRate).toBeDefined();
      expect(rating).toBe(
        config.defaultValue + 
        config.plotRate.givingScores +
        config.actorPlayRate.givingScores
      );
    });
    it('rate for 25', () => {
      reportWithOnlyRequiredProps.content = faker.helpers.arrayElement(config.profanity.list);
      reportWithOnlyRequiredProps.actorPlayRate = faker.datatype.number();

      const rating = service.rate(reportWithOnlyRequiredProps).rating;

      expect(rating).toBe(
        config.defaultValue +
        config.actorPlayRate.givingScores
      );
    });
    it('rate for 0', () => {
      reportWithOnlyRequiredProps.content = faker.helpers.arrayElement(config.profanity.list);

      const rating = service.rate(reportWithOnlyRequiredProps).rating;

      expect(rating).toBe(config.defaultValue);
    });
    it('rateresult instance', () => {
      reportWithOnlyRequiredProps.content = faker.helpers.arrayElement(config.profanity.list);

      const rating = service.rate(reportWithOnlyRequiredProps);
      
      expect(rating).toBeInstanceOf(RateResult);
    });
    it('throw invalid instance error', () => {
      expect(() => service.rate({content: '123'}))
        .toThrow(UnknownInstanceException);
    });
  });
});
