import {FilmTypeormEntity} from "./film.typeorm.entity";
import { CompanyTypeormEntity } from './company.typeorm.entity';
import { ActorTypeormEntity } from './actor.typeorm.entity';
import { UserTypeormEntity } from './user.typeorm.entity';
import {ReportTypeormEntity} from "./report.typeorm.entity";

export const entities = [
  FilmTypeormEntity,
  CompanyTypeormEntity,
  ReportTypeormEntity,
  ActorTypeormEntity,
  UserTypeormEntity,
];

export * from "./film.typeorm.entity";
export * from './company.typeorm.entity';
export * from './actor.typeorm.entity';
export * from './user.typeorm.entity';
export * from "./report.typeorm.entity";
