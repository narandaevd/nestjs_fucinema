import {Film} from "../../../../domain";
import {createFakeActor} from "../../actor/factories/actor.factory";
import {createFakeCompany} from "../../company/factories/company.factory";
import {createFakeReport} from "../../report/factories/report.factory";
import { faker } from '@faker-js/faker';

type FilmRelations = {
  company?: boolean;
  actors?: boolean;
  reports?: {
    user?: boolean;
  };
};

export function createFakeFilm(relations?: FilmRelations): Film {
  const film = new Film(faker.datatype.string());

  if (relations?.company)
    film.company = createFakeCompany();
  if (relations?.actors) {
    film.actors = [];
    for (let i = 0; i < 2; i++)
      film.actors.push(createFakeActor());
  }
  if (relations?.reports) {
    film.reports = [];
    let mode: 'full' | 'only-required';
    if (relations?.reports?.user)
      mode = 'full';
    else
      mode = 'only-required';
    for (let i = 0; i < 2; i++)
      film.reports.push(createFakeReport(mode));
  }

  return film;
}
