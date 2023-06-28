import {IAction, IActionAsync, IDispatch} from "../..";
import {HttpCode, HttpMethod} from "../../../http";
import {BASE_URL, CHANGE_DESCRIPTION_MESSAGE} from "../consts";

async function changeDescriptionQuery(
  description: string,
  login: string,
  password: string,
  uuid: string
): Promise<{
  data: ChangeDescriptionQueryBodyResponse,
  statusCode: number,
}> {
  return fetch(`${BASE_URL}/films/${uuid}`, {
    method: HttpMethod.PATCH,
    body: JSON.stringify({
      login, 
      password,
      description
    }),
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  })
    .then(async response => {
      return {data: await response.json(), statusCode: response.status};
    });
}

export interface ChangeDescriptionQueryBodyResponse {
  message?: string;
}
export interface IChangeDescriptionMessageAction extends IAction {
  message: string;
  result: boolean;
}
const changeDescriptionMessageAction = (msg: string, result: boolean): IChangeDescriptionMessageAction => ({
  type: CHANGE_DESCRIPTION_MESSAGE,
  message: msg,
  result,
});

function successfulDescriptionChangeAction() {
  return changeDescriptionMessageAction(
    'Успешное изменение описания фильма',
    true,
  );
} 
function failureDescriptionChangeAction(message: string) {
  return changeDescriptionMessageAction(
    message,
    false,
  );
};

export function changeDescriptionAction(
  description: string,
  login: string,
  password: string,
  uuid: string
): IActionAsync {
  return async (dispatch: IDispatch) => {
    return changeDescriptionQuery(description, login, password, uuid)
      .then(({data, statusCode}) => {
        if (statusCode === HttpCode.SUCCESS)
          dispatch(successfulDescriptionChangeAction());
        else
          dispatch(failureDescriptionChangeAction(data.message));
      })
      .catch((err: Error) => dispatch(failureDescriptionChangeAction(err.message)));
  }
}
