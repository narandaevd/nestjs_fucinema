import {IAction} from "../..";
import {CHANGE_REGISTER_MODAL} from "../consts";

export interface IRegisterChangeModalAction extends IAction {
  mode: boolean;
}
const registerChangeAction = (mode: boolean): IRegisterChangeModalAction => ({
  type: CHANGE_REGISTER_MODAL,
  mode,
});
export const registerOpenAction = () => registerChangeAction(true);
export const registerCloseAction = () => registerChangeAction(false);
