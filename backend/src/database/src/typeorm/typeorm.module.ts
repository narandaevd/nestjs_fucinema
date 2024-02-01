import {
  USER_REPOSITORY_TOKEN,
  IUserRepository,
  FILM_REPOSITORY_TOKEN,
  IFilmRepository,
  IReportRepository,
  REPORT_REPOSITORY_TOKEN,
  COMPANY_REPOSITORY_TOKEN,
  ACTOR_REPOSITORY_TOKEN,
  IActorRepository,
  ICompanyRepository
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
import {ACL_ERROR_RESOLVER, CONNECTION_RESOLVER} from "./consts";
import { ActorTypeormRepository, CompanyTypeormRepository } from "./repositories";
import { IAclCheckErrorResolver } from "./interfaces/acl-check-error-resolver.interface";
import { AclCheckErrorResolver } from "./services/acl-check-error-resolver";

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
const AclCheckErrorResolverProvider: Provider<IAclCheckErrorResolver> = {
  provide: ACL_ERROR_RESOLVER,
  useClass: AclCheckErrorResolver,
}
const actorTypeormRepositoryProvider: Provider<IActorRepository> = {
  provide: ACTOR_REPOSITORY_TOKEN,
  useClass: ActorTypeormRepository,
}
const companyTypeormRepositoryProvider: Provider<ICompanyRepository> = {
  provide: COMPANY_REPOSITORY_TOKEN,
  useClass: CompanyTypeormRepository,
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
      synchronize: true,
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
        AclCheckErrorResolverProvider,
        actorTypeormRepositoryProvider,
        companyTypeormRepositoryProvider,
      ],
      exports: [
        FILM_REPOSITORY_TOKEN,
        REPORT_REPOSITORY_TOKEN,
        USER_REPOSITORY_TOKEN,
        COMPANY_REPOSITORY_TOKEN,
        ACTOR_REPOSITORY_TOKEN,
      ],
    }
  }
}

@Module({})
export class TypeormModule extends BaseDatabaseModule {}
