import {IEntityMapper} from '../../interfaces';
import { Report } from '../../../../domain';
import {ReportTypeormEntity} from "../entities/report.typeorm.entity";
import { UserTypeormEntityMapper } from './user.mapper';

export class ReportTypeormEntityMapper implements IEntityMapper<Report, ReportTypeormEntity> {
  
  toEntity(model: Report): ReportTypeormEntity {
    if (model == null)
      return null;
    const userMapper = new UserTypeormEntityMapper();
    const entity: ReportTypeormEntity = Object.assign(
      new ReportTypeormEntity(),
      model,
    );
    if (model.user)
      entity.user = userMapper.toEntity(model.user);
    return entity;
  }

  toModel(entity: ReportTypeormEntity): Report {
    if (entity == null)
      return null;
    const userMapper = new UserTypeormEntityMapper();
    const model: Report = Object.assign(
      new Report(entity.content),
      entity,
    );
    if (entity.user)
      model.user = userMapper.toModel(entity.user);
    return model;
  }
}
