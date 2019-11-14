import {cloneDeep} from 'lodash';

import { Action, IndexedAction } from './utils'
import {AppState} from "./types";

interface LoadingAndErroredState {
    [key: string]:  (boolean | {} | undefined)[],
}

// todo improve these action types args
const loadingAndErroredReducer = (state: LoadingAndErroredState = {}, action: Action) => {
    const {type, payload, actionIndex} = action;
    const matches = /(.*)_(START|PROGRESS|FAILURE|COMPLETE)/.exec(type);

    if (!matches) return state;

    const [, actionName, requestState] = matches;
    const loadingName = actionName + "Loading";
    const progressName = actionName + "Progress";
    const errorName = actionName + "Errors";

    const newState = cloneDeep(state);

    switch (requestState) {
        case 'START': {
            if (!newState[loadingName]) newState[loadingName] = [];
            if (!newState[progressName]) newState[progressName] = [];
            if (!newState[errorName]) newState[errorName] = [];

            newState[loadingName][actionIndex] = true;
            newState[progressName][actionIndex] = undefined;
            newState[errorName][actionIndex] = undefined;

            return newState;
        }
        case 'COMPLETE': {
            newState[loadingName][actionIndex] = false;
            return newState;
        }
        case 'PROGRESS': {
            newState[progressName][actionIndex] = payload;
            return newState;
        }
        case 'FAILURE': {
            newState[errorName][actionIndex] = payload;
            return newState;
        }
        default:
            return state;
    }
};
const loadingSelector = (...actions: IndexedAction[]) => (state: AppState): boolean => actions.reduce((previousValue: boolean, {action, actionIndex}: IndexedAction): boolean => previousValue || Boolean(state.status[`${action}Loading`] ? state.status[`${action}Loading`][actionIndex] : false), false);
const progressSelector = ({action, actionIndex}: IndexedAction) => (state: AppState): any => state.status[`${action}Progress`] ? state.status[`${action}Progress`][actionIndex] : undefined;
const errorSelector = ({action, actionIndex}: IndexedAction) => (state: AppState): any => state.status[`${action}Progress`] ? state.status[`${action}Errors`][actionIndex] : undefined;

export {loadingSelector, progressSelector, errorSelector, loadingAndErroredReducer};
