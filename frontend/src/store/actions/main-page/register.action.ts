import {IAction, IActionAsync, IDispatch} from "../..";
import {HttpCode, HttpMethod} from "../../../http";
import {BASE_URL, CHANGE_REGISTER_MESSAGE} from "../consts";

interface RegisterBodyResponse {
  message?: string;
}

async function registerQuery(login: string, password: string): Promise<{
  data: RegisterBodyResponse,
  statusCode: number,
}> {
  return fetch(`${BASE_URL}/users/register`, {
    method: HttpMethod.POST,
    body: JSON.stringify({login, password}),
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  })
    .then(async response => {
      return {data: await response.json(), statusCode: response.status}
    });
}

export interface IChangeRegisterMessageAction extends IAction {
  message: string;
  result: boolean;
}
function changeRegisterMessageAction(msg: string, result: boolean): IChangeRegisterMessageAction {
  return {
    type: CHANGE_REGISTER_MESSAGE,
    message: msg,
    result,
  }
}
const successfulRegisterAction = () => changeRegisterMessageAction(
  'Вы успешно зарегистрировались',
  true,
);
const failureRegisterAction = (message: string) => changeRegisterMessageAction(
  message,
  false
);

export function registerAction(login: string, password: string): IActionAsync {
  return async (dispatch: IDispatch) => {
    return registerQuery(login, password)
      .then(
        ({data, statusCode}) => {
          if (statusCode === HttpCode.CREATED)
            return dispatch(successfulRegisterAction())
          else 
            return dispatch(failureRegisterAction(data.message))
        },
      );
  }
}
