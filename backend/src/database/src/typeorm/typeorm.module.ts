import {
  USER_REPOSITORY_TOKEN,
  IUserRepository,
  FILM_REPOSITORY_TOKEN,
  IFilmRepository,
  IReportRepository,
  REPORT_REPOSITORY_TOKEN
} from "../../../repository-contracts";

import {DynamicModule, Module, Provider} from "@nestjs/common";
import {FilmTypeormRepository} from "./repositories/film.repository";
import {DataSourceOptions} from 'typeorm';
import {ReportTypeormRepository} from "./repositories/report.repository";
import {UserTypeormRepository} from "./repositories/user.repository";
import {entities} from "./entities";
import {DatabaseConfig} from "../database.config";
import {BaseDatabaseModule} from "../base-classes";
import {IDatabaseModuleFactory} from "../interfaces";
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConnectionRefusedResolver} from "./services/connection-refused-resolver";
import {IConnectionRefusedResolver} from "./interfaces/connection-refused-resolver.interface";
import {CONNECTION_RESOLVER} from "./consts";

const filmTypeormRepositoryProvider: Provider<IFilmRepository> = {
  provide: FILM_REPOSITORY_TOKEN,
  useClass: FilmTypeormRepository,
};
const reportTypeormRepositoryProvider: Provider<IReportRepository> = {
  provide: REPORT_REPOSITORY_TOKEN,
  useClass: ReportTypeormRepository,
}
const userTypeormRepositoryProvider: Provider<IUserRepository> = {
  provide: USER_REPOSITORY_TOKEN,
  useClass: UserTypeormRepository,
}
const connectionRefusedResolverProvider: Provider<IConnectionRefusedResolver> = {
  provide: CONNECTION_RESOLVER,
  useClass: ConnectionRefusedResolver,
}

export class TypeormConfigFactory {
  static create(config: DatabaseConfig): DataSourceOptions {
    return {
      type: config.type as ('postgres' | 'mysql'),
      username: config.username,
      password: config.password,
      database: config.database,
      host: config.host,
      port: config.port,
      synchronize: false,
      entities: [...entities],
    }
  }
}

export class TypeormModuleFactory implements IDatabaseModuleFactory {
  create(config: DatabaseConfig): DynamicModule {
    return {
      module: TypeormModule,
      imports: [
        TypeOrmModule.forRoot(TypeormConfigFactory.create(config)),
        TypeOrmModule.forFeature([...entities]),
      ],
      providers: [
        connectionRefusedResolverProvider,
        filmTypeormRepositoryProvider,
        reportTypeormRepositoryProvider,
        userTypeormRepositoryProvider,
      ],
      exports: [
        FILM_REPOSITORY_TOKEN,
        REPORT_REPOSITORY_TOKEN,
        USER_REPOSITORY_TOKEN,
      ],
    }
  }
}

@Module({})
export class TypeormModule extends BaseDatabaseModule {}
