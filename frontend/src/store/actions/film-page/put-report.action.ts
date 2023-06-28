import {IAction, IActionAsync, IDispatch} from "../..";
import {HttpCode, HttpMethod} from "../../../http";
import {
  BASE_URL, CHANGE_PUT_REPORT_MESSAGE
} from "../consts";

async function putReportQuery(
  content: string,
  login: string,
  password: string,
  filmUuid: string,
  actorPlayRate: number,
  plotRate: number,
): Promise<{
  data: PutReportQueryBodyResponse,
  statusCode: number,
}> {
  return fetch(`${BASE_URL}/reports`, {
    method: HttpMethod.POST,
    body: JSON.stringify({
      login,
      password,
      content,
      filmUuid,
      actorPlayRate,
      plotRate,
    }),
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  })
    .then(async response => {
      return {data: await response.json(), statusCode: response.status}
    });
}

export interface PutReportQueryBodyResponse {
  message?: string;
}

export interface IChangePutReportMessageAction extends IAction {
  message: string;
  result: boolean;
}
const changePutReportMessageAction = (msg: string, result: boolean): IChangePutReportMessageAction => ({
  type: CHANGE_PUT_REPORT_MESSAGE,
  message: msg,
  result,
})
const successfulReportPutAction = () => changePutReportMessageAction(
  'Вы успешно оставили отзыв!',
  true,
);
const failureReportPutAction = (msg: string) => changePutReportMessageAction(
  msg,
  false,
);

export function putReportAction(
  content: string,
  login: string,
  password: string,
  filmUuid: string,
  actorPlayRate: number,
  plotRate: number,
): IActionAsync {
  return async (dispatch: IDispatch) => {
    return putReportQuery(content, login, password, filmUuid, actorPlayRate, plotRate)
      .then(({data, statusCode}) => {
        if (statusCode === HttpCode.CREATED) 
          dispatch(successfulReportPutAction());
        else 
          dispatch(failureReportPutAction(data.message));
      })
      .catch((err: Error) => dispatch(failureReportPutAction(err.message)));
  }
}
