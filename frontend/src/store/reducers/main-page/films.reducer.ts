import {IAction} from "../..";
import {FilmData} from "../../../components/main-page/Film";
import {IChangeFilmsAction} from "../../actions";
import {CHANGE_FILMS} from "../../actions/consts";

export interface IFilmsState {
  films: FilmData[],
  totalCount: number,  
}

export function filmsReducer(state = {
  films: [],
  totalCount: 0,
} as IFilmsState, action: IAction): IFilmsState {
  switch (action.type) {
    case CHANGE_FILMS: {
      const castedAction = action as IChangeFilmsAction;
      return {
        ...state,
        films: [...castedAction.films],
        totalCount: castedAction.totalCount,
      };
    }
    default: {
      return {...state};
    }
  }
}
