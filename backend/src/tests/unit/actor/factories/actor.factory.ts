import {Actor} from "../../../../domain";
import { faker } from '@faker-js/faker';

export function createFakeActor() {
  const actor = new Actor(
    faker.name.firstName(),
    faker.name.lastName(),
  );
  return actor;
}
