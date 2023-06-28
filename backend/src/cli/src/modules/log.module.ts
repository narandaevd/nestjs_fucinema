import {DynamicModule, Module} from "@nestjs/common";
import { 
  LogConfiguration, 
  LOG_CONFIGURATION, 
  LogConfig, 
  PINO, 
  PinoLogService
} from '../../../log';
import {BaseConfiguration, YamlReadStrategy} from "../../../config";
import {UnknownInstanceException} from "../../../exceptions";
import {ERROR_SERVICE, ErrorService} from "../../../service-layer";
import {LOG_SERVICE} from "../../../service-layer";

@Module({})
export class LogModule {
  static register(configPath: string): DynamicModule {
    return {
      global: true,
      module: LogModule,
      providers: [
        {
          provide: ERROR_SERVICE,
          useClass: ErrorService,
        },
        {
          provide: LOG_CONFIGURATION,
          useFactory() {
            const conf = new LogConfiguration(new YamlReadStrategy());
            conf.readConfig(configPath);
            return conf;
          }
        },
        {
          provide: LOG_SERVICE,
          useFactory(conf: BaseConfiguration<LogConfig>) {
            const config = conf.getConfig();
            switch (config.logger) {
              case PINO: {
                return new PinoLogService(config);
              }
              default: {
                throw new UnknownInstanceException('invalid logger type');
              }
            }
          },
          inject: [LOG_CONFIGURATION]
        }
      ],
      exports: [
        LOG_SERVICE,
        ERROR_SERVICE
      ],
    }
  }
}
