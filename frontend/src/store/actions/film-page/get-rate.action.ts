import {IAction, IActionAsync, IDispatch} from "../..";
import {HttpMethod} from "../../../http";
import {BASE_URL, GET_RATE} from "../consts";

async function getRateQuery(
  content: string,
  plotRate?: number,
  actorPlayRate?: number,
): Promise<GetQueryBodyResponse> {
  return fetch(`${BASE_URL}/rate`, {
    method: HttpMethod.POST,
    body: JSON.stringify({
      content,
      plotRate,
      actorPlayRate,
    }),
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  })
    .then(response => response.json());
}

export enum RateOptionCheckCode {
  SUCCESS = 'success',
  FAILURE = 'failure',
} 
export interface IRateOptionCheckResult {
  failureMessage?: string;
  code: RateOptionCheckCode;
  givingScores: number;
}
export interface IChangeResultsAction extends IAction {
  rating: number;
  maxRating: number;
  results: IRateOptionCheckResult[];
}
const changeResultsAction = (
  rating: number, 
  results: IRateOptionCheckResult[],
  maxRating: number,
): IChangeResultsAction => ({
  type: GET_RATE,
  rating,
  results,
  maxRating,
});

interface GetQueryBodyResponse {
  rating: number;
  maxRating: number;
  checkResults: IRateOptionCheckResult[];
}

export function getRateAction(
  content: string,
  plotRate?: number,
  actorPlayRate?: number
): IActionAsync {
  return async (dispatch: IDispatch) => {
    return getRateQuery(content, plotRate, actorPlayRate)
      .then(body => dispatch(changeResultsAction(
          body.rating, 
          body.checkResults,
          body.maxRating
        )));
  }
}
