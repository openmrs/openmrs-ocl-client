import { AxiosResponse } from "axios";
import { Action, IndexedAction } from "./types";

export const RESET = "RESET";
export const START = "START";
export const FAILURE = "FAILURE";
export const PROGRESS = "PROGRESS";
export const COMPLETE = "COMPLETE";

export const loading = (actionType: string): string => `${actionType}Loading`;
export const progress = (actionType: string): string => `${actionType}Progress`;
export const errors = (actionType: string): string => `${actionType}Errors`;

export const createActionType = (actionType: string): Function => (): {
  [key: string]: string;
} => ({ type: actionType });

export const indexedAction = (
  action: string,
  actionIndex: number = 0
): IndexedAction => ({ actionType: action, actionIndex });

export function getIndexedAction (actionOrActionType: IndexedAction | string) {
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

export function startAction (actionOrActionType: IndexedAction | string, ...args: any[]) {
  const { actionType, actionIndex } = getIndexedAction(actionOrActionType);

  return {
    type: `${actionType}_${START}`,
    actionIndex,
    meta: args
  }
}

export function progressAction (
  actionOrActionType: IndexedAction | string,
  payload: string
) {
  const { actionType, actionIndex } = getIndexedAction(actionOrActionType);

  return {
    type: `${actionType}_${PROGRESS}`,
      actionIndex,
      payload
  };
}

export function completeAction (
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

export const createActionThunk = <T extends any[]>(
  actionOrActionType: IndexedAction | string,
  task: (...args: T) => Promise<AxiosResponse<any>>
) => {
  /*
   ** Create an redux thunk that dispatches start, runs task then dispatches (success or failure) and completed actions
   */

  const action = getIndexedAction(actionOrActionType);
  const { actionType, actionIndex } = action;

  return <S>(...args: T) => {
    return async (dispatch: (action: Action) => {}): Promise<boolean | S> => {
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
          console.log(error);
          dispatch({
            type: `${actionType}_${FAILURE}`,
            actionIndex: actionIndex,
            payload: error.response.data,
            meta: args
          });
          result = false;
        }
      } catch (error) {
        console.log("should not happen", error);

        dispatch({
          type: `${actionType}_${FAILURE}`,
          actionIndex: actionIndex,
          payload: { __all__: ["The action could not be completed (1)"] },
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
