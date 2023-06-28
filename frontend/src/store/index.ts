import {
  combineReducers, 
  legacy_createStore as createStore,
  applyMiddleware,
  Action,
} from 'redux';
import { 
  filmsReducer 
} from './reducers/main-page';
import thunk, {ThunkDispatch} from 'redux-thunk';
import {filmReducer} from './reducers/film-page';
import {registerReducer} from './reducers/main-page/register.reducer';
import {Dispatch} from 'react';

const rootReducer = combineReducers({
  films: filmsReducer,
  film: filmReducer,
  register: registerReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
export type IRootState = ReturnType<typeof store.getState>;
type ActionType = string;
export type IAction = Action<ActionType>;
export type IDispatch = Dispatch<IAction> & ThunkDispatch<IRootState, {}, IAction>;
export type IActionAsync = (dispatch: IDispatch) => Promise<void>;
