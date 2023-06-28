import {IAction, IActionAsync, IDispatch} from "../..";
import {FullFilmInfo} from "../../reducers/film-page";
import {BASE_URL, CHANGE_FILM} from "../consts";

async function getFullFilmInfoQuery(uuid: string): Promise<FullFilmInfo> {
  return fetch(`${BASE_URL}/films/${uuid}`)
    .then(response => response.json());
}

export interface IChangeFilmAction extends IAction {
  film: FullFilmInfo;
}

function changeFilmAction(film: FullFilmInfo) {
  return {
    type: CHANGE_FILM,
    film,
  }
}

export function loadFilmAction(uuid: string): IActionAsync {
  return async (dispatch: IDispatch) => {
    return getFullFilmInfoQuery(uuid)
      .then(fullFilmInfo => dispatch(changeFilmAction(fullFilmInfo)));
  }
}
