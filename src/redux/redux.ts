import {Action} from "./utils";
import {AppState} from "./types";

interface LoadingAndErroredState {
    [key: string]: boolean | {} | undefined,
}

// todo improve these action types args
const loadingAndErroredReducer = (state: LoadingAndErroredState = {}, action: Action) => {
    const {type, payload} = action;
    const matches = /(.*)_(START|PROGRESS|FAILURE|COMPLETE)/.exec(type);

    if (!matches) return state;

    const [, actionName, requestState] = matches;
    const loadingName = actionName + "Loading";
    const progressName = actionName + "Progress";
    const errorName = actionName + "Errors";

    switch (requestState) {
        case 'START':
            return {
                ...state,
                [loadingName]: true,
                [progressName]: undefined,
                [errorName]: undefined,
            };
        case 'COMPLETE':
            return {
                ...state,
                [loadingName]: false,
            };
        case 'PROGRESS':
            return {
                ...state,
                [progressName]: payload,
            };
        case 'FAILURE':
            return {
                ...state,
                [errorName]: payload,
            };
        default:
            return state;
    }
};
const loadingSelector = (...actions: string[]) => (state: AppState): boolean => actions.reduce((previousValue: boolean, currentValue: string): boolean => previousValue || Boolean(state.status[`${currentValue}Loading`]), false);
const progressSelector = (action: string) => (state: AppState): any => state.status[`${action}Progress`];
const errorSelector = (action: string) => (state: AppState): any => state.status[`${action}Errors`];

export {loadingSelector, progressSelector, errorSelector, loadingAndErroredReducer};
