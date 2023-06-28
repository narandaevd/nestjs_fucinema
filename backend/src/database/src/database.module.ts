import {
  BaseConfiguration,
  YamlReadStrategy
} from '../../config';
import {UnknownInstanceException} from '../../exceptions';

import {DynamicModule, Module, Type} from '@nestjs/common';
import { TypeormModule, TypeormModuleFactory } from './typeorm';
import {DatabaseConfig} from './database.config';
import {DatabaseConfiguration} from './database.configuration';
import {TYPEORM} from './consts';
import {BaseDatabaseModule} from './base-classes';

@Module({})
export class DatabaseModule {
  static register(filePath: string): DynamicModule {
    const conf: BaseConfiguration<DatabaseConfig> = new DatabaseConfiguration(new YamlReadStrategy());
    conf.readConfig(filePath);
    const config = conf.getConfig();

    let moduleContainer: {
      dynamicModule: DynamicModule,
      class: Type<BaseDatabaseModule>,
    };

    switch (config.toolType) {
      case TYPEORM: {
        moduleContainer = {
          dynamicModule: new TypeormModuleFactory().create(config),
          class: TypeormModule,
        };  
        break;
      }
      default:
        throw new UnknownInstanceException("invalid toolType");
    }

    return {
      global: true,
      module: DatabaseModule,
      imports: [moduleContainer.dynamicModule],
      exports: [moduleContainer.class],
    }
  }
}
