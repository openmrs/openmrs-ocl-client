import { cloneDeep } from "lodash";
import {
  errors,
  loading,
  progress,
  COMPLETE,
  FAILURE,
  PROGRESS,
  RESET,
  START,
  meta
} from "./utils";
import { Action, StatusState } from "./types";
import {LOGOUT_ACTION} from "../apps/authentication/redux/actionTypes";

// todo improve these action types args
const loadingAndErroredReducer = (
  state: StatusState = {},
  action: Action
) => {
  const { type, payload, actionIndex, meta: actionMeta } = action;

  if(type === LOGOUT_ACTION){
    return {}
  }

  const matches = /(.*)_(START|PROGRESS|FAILURE|COMPLETE|RESET)/.exec(type);

  if (!matches) return state;

  const [, actionName, requestState] = matches;
  const loadingName = loading(actionName);
  const progressName = progress(actionName);
  const errorName = errors(actionName);
  const metaName = meta(actionName);

  const newState = cloneDeep(state);

  switch (requestState) {
    case RESET: {
      newState[loadingName] = [];
      newState[progressName] = [];
      newState[errorName] = [];
      newState[metaName] = [];

      return newState;
    }
    case START: {
      if (!newState[loadingName]) newState[loadingName] = [];
      if (!newState[progressName]) newState[progressName] = [];
      if (!newState[errorName]) newState[errorName] = [];
      if (!newState[metaName]) newState[metaName] = [];

      newState[loadingName][actionIndex] = true;
      newState[progressName][actionIndex] = undefined;
      newState[errorName][actionIndex] = undefined;
      newState[metaName][actionIndex] = actionMeta;

      return newState;
    }
    case COMPLETE: {
      newState[loadingName][actionIndex] = false;
      return newState;
    }
    case PROGRESS: {
      newState[progressName][actionIndex] = payload;
      return newState;
    }
    case FAILURE: {
      newState[errorName][actionIndex] = payload;
      return newState;
    }
    default:
      return state;
  }
};

export default loadingAndErroredReducer;
