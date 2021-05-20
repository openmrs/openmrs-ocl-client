import { AxiosResponse } from "axios";
import { isEqual } from "lodash";
import { Action, AppState, IndexedAction } from "./types";
import { debug,STATUS_CODES_TO_MESSAGES } from "../utils";
import { errorSelector, metaSelector } from "./selectors";

export const RESET = "RESET";
export const START = "START";
export const FAILURE = "FAILURE";
export const PROGRESS = "PROGRESS";
export const COMPLETE = "COMPLETE";

export const loading = (actionType: string): string => `${actionType}Loading`;
export const progress = (actionType: string): string => `${actionType}Progress`;
export const errors = (actionType: string): string => `${actionType}Errors`;
export const meta = (actionType: string): string => `${actionType}Meta`;

export const createActionType = (actionType: string): Function => (): {
  [key: string]: string;
} => ({ type: actionType });

export const indexedAction = (
  action: string,
  actionIndex: number = 0
): IndexedAction => ({ actionType: action, actionIndex });

export function getIndexedAction(actionOrActionType: IndexedAction | string) {
  return typeof actionOrActionType === "string"
    ? indexedAction(actionOrActionType)
    : actionOrActionType;
}

export function action(type: string) {
  return { type };
}

export const resetAction = (actionType: string) => ({
  type: `${actionType}_${RESET}`
});

export function startAction(
  actionOrActionType: IndexedAction | string,
  ...args: any[]
) {
  const { actionType, actionIndex } = getIndexedAction(actionOrActionType);

  return {
    type: `${actionType}_${START}`,
    actionIndex,
    meta: args
  };
}

export function progressAction(
  actionOrActionType: IndexedAction | string,
  payload: string,
  ...args: any[]
) {
  const { actionType, actionIndex } = getIndexedAction(actionOrActionType);

  return {
    type: `${actionType}_${PROGRESS}`,
    actionIndex,
    payload,
    meta: args
  };
}

export function completeAction(
  actionOrActionType: IndexedAction | string,
  ...args: any[]
) {
  const { actionType, actionIndex } = getIndexedAction(actionOrActionType);

  return {
    type: `${actionType}_${COMPLETE}`,
    actionIndex,
    meta: args
  };
}

export function cachedAction(
  actionOrActionType: IndexedAction | string,
  ...args: any[]
) {
  const { actionType, actionIndex } = getIndexedAction(actionOrActionType);

  return {
    type: `${actionType}_CACHE_HIT`,
    actionIndex,
    meta: args
  };
}

function isCacheable(action: IndexedAction, meta: any[], state: AppState) {
  return (
    isEqual(meta, metaSelector(action)(state)) && !errorSelector(action)(state)
  );
}

export function invalidateCache(action: string, dispatch: Function) {
  dispatch(resetAction(action));
}

export function errorMsgResponse(response: any) {
  const errorMsgResponse: {[key: string]: string} = {
    "__detail__": "Action could not be completed. Please retry."
  };

  if (response.data && Object.prototype.hasOwnProperty.call(response.data, "detail")) { 
    errorMsgResponse["__detail__"] = response.data.detail;
  }
  
  for (let key in response.data) {
    if (key === "__detail__") continue;
    errorMsgResponse[key] =
        Array.isArray(response.data[key])
          ? response.data[key].join(",")
          : response.data[key]
    } 
    return errorMsgResponse;
  };

export const createActionThunk = <T extends any[]>(
  actionOrActionType: IndexedAction | string,
  task: (...args: T) => Promise<AxiosResponse<any>>,
  useCache = false
) => {
  /*
   ** Create an redux thunk that dispatches start, runs task then dispatches (success or failure) and completed actions
   */

  const action = getIndexedAction(actionOrActionType);
  const { actionType, actionIndex } = action;

  return <S>(...args: T) => {
    return async (
      dispatch: (action: Action) => {},
      getState: () => AppState
    ): Promise<boolean | S> => {
      if (useCache && isCacheable(action, args, getState())) {
        dispatch(cachedAction(action, ...args));
        return true;
      }

      let result = true;

      try {
        dispatch(startAction(action, ...args));

        try {
          const response = await task(...args);
          dispatch({
            type: actionType,
            actionIndex: actionIndex,
            payload: response.data,
            meta: args,
            responseMeta: response.headers
          });

          result = response.data;
        } catch (error) {
          debug(error, "redux/utils/#createActionThunk#:catch");

          const response = error.response;

          let errorMsg = errorMsgResponse(response);

          const errorMsgResponse: {[key: string]: string} = {
            "__detail__": "Action could not be completed. Please retry."
          }

          dispatch({
            type: `${actionType}_${FAILURE}`,
            actionIndex: actionIndex,
            payload: errorMessage,
            meta: args
          });

          result = false;
        }
      } catch (error) {
        debug("should not happen", error);

        dispatch({
          type: `${actionType}_${FAILURE}`,
          actionIndex: actionIndex,
          payload: "The action could not be completed (1)",
          meta: args
        });

        result = false;
      } finally {
        dispatch(completeAction(action, ...args));
      }

      return result;
    };
  };
};
