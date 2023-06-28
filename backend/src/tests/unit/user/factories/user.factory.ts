import {User} from '../../../../domain/dist';
import { faker } from '@faker-js/faker';

export function createFakeUser(): User {
  const user = new User(faker.lorem.words(3), faker.lorem.slug());
  user.uuid = faker.datatype.uuid();
  return user;
}
