import {IEntityMapper} from '../../interfaces';
import { Actor } from '../../../../domain';
import { ActorTypeormEntity } from '../entities/actor.typeorm.entity';

export class ActorTypeormEntityMapper implements IEntityMapper<Actor, ActorTypeormEntity> {
  
  toEntity(model: Actor): ActorTypeormEntity {
    if (model == null)
      return null;
    const ent = new ActorTypeormEntity();
    ent.uuid = model.uuid;
    if (model.country)
      ent.country = model.country;
    ent.firstName = model.firstName;
    ent.lastName = model.lastName;
    if (model.middleName)
      ent.middleName = model.middleName;
    return ent;
  }

  toModel(entity: ActorTypeormEntity): Actor {
    if (entity == null)
      return null;
    const model = new Actor(entity.firstName, entity.lastName);
    model.uuid = entity.uuid;
    if (entity.country)
      model.country = entity.country;
    if (model.middleName)
      model.middleName = entity.middleName;
    return model;
  }
}
