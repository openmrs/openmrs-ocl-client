import { cloneDeep } from "lodash";

import { errors, loading, progress, COMPLETE, FAILURE, PROGRESS, RESET, START } from './utils'
import { Action, LoadingAndErroredState } from "./types";

// todo improve these action types args
const loadingAndErroredReducer = (
  state: LoadingAndErroredState = {},
  action: Action
) => {
  const { type, payload, actionIndex } = action;
  const matches = /(.*)_(START|PROGRESS|FAILURE|COMPLETE|RESET)/.exec(type);

  if (!matches) return state;

  const [, actionName, requestState] = matches;
  const loadingName = loading(actionName);
  const progressName = progress(actionName);
  const errorName = errors(actionName);

  const newState = cloneDeep(state);

  switch (requestState) {
    case RESET: {
      newState[loadingName] = [];
      newState[progressName] = [];
      newState[errorName] = [];

      return newState;
    }
    case START: {
      if (!newState[loadingName]) newState[loadingName] = [];
      if (!newState[progressName]) newState[progressName] = [];
      if (!newState[errorName]) newState[errorName] = [];

      newState[loadingName][actionIndex] = true;
      newState[progressName][actionIndex] = undefined;
      newState[errorName][actionIndex] = undefined;

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
