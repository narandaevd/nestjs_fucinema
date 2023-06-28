import {IAction} from "../..";
import {CHANGE_DESCRIPTION_MODAL} from "../consts";

export interface IChangeDescriptionModalAction extends IAction {
  value: boolean;
}
function changeDescriptionOpenModalAction(value: boolean): IChangeDescriptionModalAction {
  return {type: CHANGE_DESCRIPTION_MODAL, value};
}

export const openDescriptionModalAction = () => changeDescriptionOpenModalAction(true);
export const closeDescriptionModalAction = () => changeDescriptionOpenModalAction(false);
