import { AppState, IndexedAction } from "./types";
import { errors, getIndexedAction, loading, meta, progress } from "./utils";

export function loadingSelector(...actions: (IndexedAction | string)[]) {
  const indexedActions: IndexedAction[] = actions.map(action =>
    getIndexedAction(action)
  );

  return (state: AppState): boolean =>
    indexedActions.reduce(
      (
        previousValue: boolean,
        { actionType, actionIndex }: IndexedAction
      ): boolean => {
        const loadingList = loadingListSelector(actionType)(state);
        return (
          previousValue ||
          Boolean(loadingList ? loadingList[actionIndex] : false)
        );
      },
      false
    );
}

export function progressSelector(actionOrActionType: IndexedAction | string) {
  const { actionType, actionIndex } = getIndexedAction(actionOrActionType);

  return (state: AppState): any => {
    const progressList = progressListSelector(actionType)(state);
    return progressList ? progressList[actionIndex] : undefined;
  };
}

export function errorSelector(actionOrActionType: IndexedAction | string) {
  const { actionType, actionIndex } = getIndexedAction(actionOrActionType);

  return (state: AppState): any => {
    const errorList = errorListSelector(actionType)(state);
    return errorList ? errorList[actionIndex] : undefined;
  };
}

export function metaSelector(actionOrActionType: IndexedAction | string) {
  const { actionType, actionIndex } = getIndexedAction(actionOrActionType);

  return (state: AppState): any =>
    state.status[meta(actionType)]
      ? state.status[meta(actionType)][actionIndex]
      : undefined;
}

export const loadingListSelector = (actionType: string) => (
  state: AppState
): any | undefined =>
  state.status[loading(actionType)]
    ? state.status[loading(actionType)]
    : undefined;

export const progressListSelector = (actionType: string) => (
  state: AppState
): any | undefined =>
  state.status[progress(actionType)]
    ? state.status[progress(actionType)]
    : undefined;

export const errorListSelector = (actionType: string) => (
  state: AppState
): any | undefined =>
  state.status[errors(actionType)]
    ? state.status[errors(actionType)]
    : undefined;
