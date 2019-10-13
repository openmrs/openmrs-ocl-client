import {Action} from "./utils";

interface AppState {
    auth: {},
    status: { [key: string]: boolean | string | undefined },
}

interface LoadingAndErroredState {
    [key: string]: boolean | {} | undefined,
}

// todo improve these action types args
const loadingAndErroredReducer = (state: LoadingAndErroredState = {}, action: Action) => {
    const {type, payload} = action;
    const matches = /(.*)_(START|FAILURE|COMPLETE)/.exec(type);

    if (!matches) return state;

    const [, actionName, requestState] = matches;
    const loadingName = actionName + "Loading";
    const errorName = actionName + "Errors";

    switch (requestState) {
        case 'START':
            return {
                ...state,
                [loadingName]: true,
                [errorName]: undefined,
            };
        case 'COMPLETE':
            return {
                ...state,
                [loadingName]: false,
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
const errorSelector = (action: string) => (state: AppState): any => state.status[`${action}Errors`];

export {loadingSelector, errorSelector, loadingAndErroredReducer};
