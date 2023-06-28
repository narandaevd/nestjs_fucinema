import {IAction} from "../..";
import {IChangeRegisterMessageAction, IRegisterChangeModalAction} from "../../actions";
import {
  CHANGE_REGISTER_MESSAGE,
  CHANGE_REGISTER_MODAL
} from "../../actions/consts";

export interface IRegisterState {
  msg: string;
  isModalOpen: boolean;
  registerResult: boolean;
}

export function registerReducer(
  state: IRegisterState = {
    msg: '',
    isModalOpen: false,
    registerResult: null,
  }, 
  action: IAction
): IRegisterState {
  switch (action.type) {
    case CHANGE_REGISTER_MESSAGE: {
      return {
        ...state, 
        msg: (action as IChangeRegisterMessageAction).message,
        registerResult: (action as IChangeRegisterMessageAction).result,
      };
    }
    case CHANGE_REGISTER_MODAL: {
      return {
        ...state,
        isModalOpen: (action as IRegisterChangeModalAction).mode, 
      }
    }
    default: {
      return {...state};
    }
  }
}
