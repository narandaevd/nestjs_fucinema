import {IAction} from "../..";
import {
  CHANGE_DESCRIPTION_MESSAGE,
  CHANGE_DESCRIPTION_MODAL, 
  CHANGE_FILM, 
  CHANGE_PUT_REPORT_MESSAGE, 
  GET_RATE
} from "../../actions/consts";
import {
  IChangeDescriptionMessageAction, 
  IChangeDescriptionModalAction, 
  IChangeFilmAction, 
  IChangePutReportMessageAction
} from "../../actions/film-page";
import {IChangeResultsAction, IRateOptionCheckResult} from "../../actions/film-page/get-rate.action";

export class CompanyInfo {
  title: string;
  uuid: string;
  country?: string;
}

export class ActorInfo {
  uuid: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  country?: string;
}

export class UserInfo {
  login: string;
  uuid: string;
}

export class ReportInfo {
  uuid: string;
  content: string;
  actorPlayRate: string;
  plotRate: string;
  rate?: number;
  user?: UserInfo;
}

export class FullFilmInfo {
  title: string;
  uuid: string;
  description?: string;
  company?: CompanyInfo;
  actors: ActorInfo[];
  reports: ReportInfo[];
}

export interface FilmState {
  filmInfo: FullFilmInfo;
  putReportMessage: string;
  putReportResult: boolean;
  changeDescriptionMessage: string;
  changeDescriptionResult: boolean;
  isModalOpen: boolean;
  rating: number;
  maxRating: number;
  results: IRateOptionCheckResult[];
}

export function filmReducer(state = {
  putReportMessage: '',
  changeDescriptionMessage: '',
  results: []
} as FilmState, action: IAction): FilmState {
  switch (action.type) {
    case CHANGE_FILM: {
      return {
        ...state,
        filmInfo: (action as IChangeFilmAction).film,
      };
    }
    case CHANGE_DESCRIPTION_MODAL: {
      return {
        ...state,
        isModalOpen: (action as IChangeDescriptionModalAction).value,
      }
    }
    case CHANGE_PUT_REPORT_MESSAGE: {
      const castedAction = action as IChangePutReportMessageAction;
      return {
        ...state,
        putReportResult: castedAction.result,
        putReportMessage: castedAction.message,
      }
    }
    case GET_RATE: {
      const castedAction = action as IChangeResultsAction;
      return {
        ...state,
        rating: castedAction.rating,
        results: castedAction.results,
        maxRating: castedAction.maxRating,
      }
    }
    case CHANGE_DESCRIPTION_MESSAGE: {
      const castedAction = action as IChangeDescriptionMessageAction;
      return {
        ...state,
        changeDescriptionResult: castedAction.result,
        changeDescriptionMessage: castedAction.message,
      }
    }
    default: {
      return {...state};
    }
  }
}
