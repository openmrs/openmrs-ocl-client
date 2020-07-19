import {errorSelector, indexedAction, loadingSelector} from "../../../redux";
import {CREATE_SOURCE_ACTION, EDIT_SOURCE_ACTION, RETRIEVE_SOURCES_ACTION} from "./actionTypes";
import {ORG_SOURCES_ACTION_INDEX, PERSONAL_SOURCES_ACTION_INDEX} from "./constants";

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
