import {IEntityMapper} from '../../interfaces';
import {Film} from "../../../../domain";
import {FilmTypeormEntity} from "../entities/film.typeorm.entity";
import {ActorTypeormEntityMapper} from "./actor.mapper";
import {ReportTypeormEntityMapper} from "./report.mapper";
import { CompanyTypeormEntityMapper } from './company.mapper';

export class FilmTypeormEntityMapper implements IEntityMapper<Film, FilmTypeormEntity> {
  toEntity(model: Film): FilmTypeormEntity {
    if (model == null)
      return null;

    const actorMapper = new ActorTypeormEntityMapper();
    const reportMapper = new ReportTypeormEntityMapper();
    const companyMapper = new CompanyTypeormEntityMapper();

    const entity = new FilmTypeormEntity();
    entity.uuid = model.uuid;
    if (model.description)
      entity.description = model.description;
    entity.title = model.title;

    if (model.company)
      entity.company = companyMapper.toEntity(model.company);
    if (model.companyUuid)
      entity.companyUuid = model.companyUuid;
    if (model.actors)
      entity.actors = model.actors.map(actor => actorMapper.toEntity(actor));
    if (model.reports)
      entity.reports = model.reports.map(r => reportMapper.toEntity(r));

      return entity;
  }
  toModel(entity: FilmTypeormEntity): Film {
    if (entity == null)
      return null;
      
    const actorMapper = new ActorTypeormEntityMapper();
    const reportMapper = new ReportTypeormEntityMapper();
    const companyMapper = new CompanyTypeormEntityMapper();

    const model = new Film(entity.title);
    model.uuid = entity.uuid;
    if (entity.description)
      model.description = entity.description;

    if (entity.company)
      model.company = companyMapper.toModel(entity.company);
    if (entity.companyUuid)
      model.companyUuid = entity.companyUuid;
    if (entity.actors)
      model.actors = entity.actors.map(a => actorMapper.toModel(a));
    if (entity.reports)
      model.reports = entity.reports.map(r => reportMapper.toModel(r));

    return model;
  }
}
