import {Company} from "../../../../domain";
import { faker } from '@faker-js/faker';

export function createFakeCompany() {
  const company = new Company(
    faker.company.name()
  )
  return company;
}
