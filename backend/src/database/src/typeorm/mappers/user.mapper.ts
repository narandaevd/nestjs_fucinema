import { User } from '../../../../domain';
import {IEntityMapper} from '../../interfaces';
import {UserTypeormEntity} from "../entities/user.typeorm.entity";

export class UserTypeormEntityMapper implements IEntityMapper<User, UserTypeormEntity> {
  toEntity(model: User): UserTypeormEntity {
    if (model == null)
      return null;
    const userEntity = Object.assign(
      new UserTypeormEntity(),
      model
    );
    userEntity.roles = model.roles;
    return userEntity;
  }
  toModel(entity: UserTypeormEntity): User {
    if (entity == null)
      return null;
    const model = Object.assign(
      new User(entity.login, entity.password),
      entity
    )
    model.roles = entity.roles;
    return model;
  }
}
