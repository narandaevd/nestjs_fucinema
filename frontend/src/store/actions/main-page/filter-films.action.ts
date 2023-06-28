import {IAction, IActionAsync, IDispatch} from "../..";
import {FilmData} from "../../../components/main-page/Film";
import {BASE_URL, CHANGE_FILMS} from "../consts";

interface IFilmResponse {
  films: FilmData[];
  totalCount: number;
}
async function filterFilmsQuery(skip: number, take: number): Promise<IFilmResponse> {
  return fetch(`${BASE_URL}/films?skip=${skip}&take=${take}`)
    .then(response => response.json());
}

export interface IChangeFilmsAction extends IAction {
  films: FilmData[];
  totalCount: number;
}
function changeFilmsAction(films: FilmData[], totalCount: number): IChangeFilmsAction {
  return {
    type: CHANGE_FILMS,
    films,
    totalCount,
  }
}

export function filterFilmsAction(skip: number, take: number): IActionAsync {
  return async (dispatch: IDispatch) => {
    return filterFilmsQuery(skip, take)
      .then(({films, totalCount}) => dispatch(changeFilmsAction(films, totalCount)));
  }
}
