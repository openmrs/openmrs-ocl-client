import {AppState, errorSelector, indexedAction, loadingSelector} from "../../../redux";
import {ORG_SOURCES_ACTION_INDEX, PERSONAL_SOURCES_ACTION_INDEX} from "./constants";
import {CREATE_SOURCE_ACTION, EDIT_SOURCE_ACTION, RETRIEVE_SOURCE_ACTION, RETRIEVE_SOURCES_ACTION} from "./actionTypes";

export const createSourceErrorSelector = errorSelector(
    CREATE_SOURCE_ACTION);
export const editSourceErrorSelector = errorSelector(
    EDIT_SOURCE_ACTION);
export const retrievePersonalSourcesLoadingSelector = loadingSelector(
    indexedAction(
        RETRIEVE_SOURCES_ACTION,
        PERSONAL_SOURCES_ACTION_INDEX
    )
);
export const retrieveOrgSourcesLoadingSelector = loadingSelector(
    indexedAction(
        RETRIEVE_SOURCES_ACTION,
        ORG_SOURCES_ACTION_INDEX
    )
);

export function sourceSelector(state: AppState) {
    return state.sources.source;
};

export const retrieveSourceErrorSelector = errorSelector(
    RETRIEVE_SOURCE_ACTION
);

export const retrieveSourceLoadingSelector = loadingSelector(
    RETRIEVE_SOURCE_ACTION
);
