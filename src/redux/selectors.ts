import { AppState, IndexedAction } from "./types";
import { errors, loading, progress } from "./utils";

export const loadingSelector = (...actions: IndexedAction[]) => (
  state: AppState
): boolean =>
  actions.reduce(
    (
      previousValue: boolean,
      { actionType, actionIndex }: IndexedAction
    ): boolean =>
      previousValue ||
      Boolean(
        state.status[loading(actionType)]
          ? state.status[loading(actionType)][actionIndex]
          : false
      ),
    false
  );
export const progressSelector = ({
  actionType,
  actionIndex
}: IndexedAction) => (state: AppState): any =>
  state.status[progress(actionType)]
    ? state.status[progress(actionType)][actionIndex]
    : undefined;
export const errorSelector = ({ actionType, actionIndex }: IndexedAction) => (
  state: AppState
): any =>
  state.status[errors(actionType)]
    ? state.status[errors(actionType)][actionIndex]
    : undefined;
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
