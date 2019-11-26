import {cloneDeep} from 'lodash';

import { Action, IndexedAction } from './utils'
import {AppState} from "./types";

interface LoadingAndErroredState {
    [key: string]:  (boolean | {} | undefined)[],
}

// todo improve these action types args
const loadingAndErroredReducer = (state: LoadingAndErroredState = {}, action: Action) => {
    const {type, payload, actionIndex} = action;
    const matches = /(.*)_(START|PROGRESS|FAILURE|COMPLETE|RESET)/.exec(type);

    if (!matches) return state;

    const [, actionName, requestState] = matches;
    const loadingName = actionName + "Loading";
    const progressName = actionName + "Progress";
    const errorName = actionName + "Errors";

    const newState = cloneDeep(state);

    switch (requestState) {
        case 'RESET': {
            newState[loadingName] = [];
            newState[progressName] = [];
            newState[errorName] = [];

            return newState;
        }
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
const loadingSelector = (...actions: IndexedAction[]) => (state: AppState): boolean => actions.reduce((previousValue: boolean, {actionType, actionIndex}: IndexedAction): boolean => previousValue || Boolean(state.status[`${actionType}Loading`] ? state.status[`${actionType}Loading`][actionIndex] : false), false);
const progressSelector = ({actionType, actionIndex}: IndexedAction) => (state: AppState): any => state.status[`${actionType}Progress`] ? state.status[`${actionType}Progress`][actionIndex] : undefined;
const errorSelector = ({actionType, actionIndex}: IndexedAction) => (state: AppState): any => state.status[`${actionType}Progress`] ? state.status[`${actionType}Errors`][actionIndex] : undefined;

export {loadingSelector, progressSelector, errorSelector, loadingAndErroredReducer};
