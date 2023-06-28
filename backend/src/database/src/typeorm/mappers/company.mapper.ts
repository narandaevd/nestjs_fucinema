import {IEntityMapper} from '../../interfaces';
import { Company } from '../../../../domain';
import {CompanyTypeormEntity} from '../entities/company.typeorm.entity';

export class CompanyTypeormEntityMapper implements IEntityMapper<Company, CompanyTypeormEntity> {
  toEntity(model: Company): CompanyTypeormEntity {
    if (model == null)
      return null;
    const ent = new CompanyTypeormEntity();
    ent.uuid = model.uuid;
    ent.title = model.title;
    if (model.country)
      ent.country = model.country;
    return ent;
  }
  toModel(entity: CompanyTypeormEntity): Company {
    if (entity == null)
      return null;
    const model = new Company(entity.title);
    model.uuid = entity.uuid;
    if (entity.country)
      model.country = entity.country;
    return model;
  }
}
