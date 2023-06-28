import {
  ReportFactory,
  User,
  Report
} from "../../../../domain";

import {faker} from '@faker-js/faker';
import {createFakeUser} from "../../user/factories/user.factory";

export function createFakeReport(mode: 'only-required' | 'full'): Report {
  if (mode === 'only-required') {
    return ReportFactory.create(faker.lorem.word(10));
  } else if (mode === 'full') {
    const user = createFakeUser();
    return ReportFactory.create(
      faker.lorem.word(10),
      {
        rate: faker.datatype.number(),
        filmUuid: faker.datatype.uuid(),
        userUuid: user.uuid,
        user,
        plotRate: faker.datatype.number(100),
        actorPlayRate: faker.datatype.number(100),
      }
    );
  }
}

export function createFakeReportByUserAndFilmUuid(user: User, filmUuid: string): Report {
  return ReportFactory.create(
    faker.lorem.word(10),
    {
      filmUuid,
      rate: faker.datatype.number(),
      userUuid: user.uuid,
      user,
      plotRate: faker.datatype.number(100),
      actorPlayRate: faker.datatype.number(100),
    }
  );
}
