import {createActionThunk, indexedAction} from "../../../redux";
import {CREATE_SOURCE_ACTION, EDIT_SOURCE_ACTION, RETRIEVE_SOURCE_ACTION, RETRIEVE_SOURCES_ACTION} from "./actionTypes";
import api from "../api";
import {ORG_SOURCES_ACTION_INDEX, PERSONAL_SOURCES_ACTION_INDEX, PUBLIC_SOURCES_ACTION_INDEX} from "./constants";
import {APISource} from "../types";

export const createSourceAction = createActionThunk(
    CREATE_SOURCE_ACTION,
    api.create);
export const editSourceAction = createActionThunk(
    EDIT_SOURCE_ACTION,
    api.update);

export const retrievePersonalSourcesAction = createActionThunk(
    indexedAction(
        RETRIEVE_SOURCES_ACTION,
        PERSONAL_SOURCES_ACTION_INDEX
    ),
    api.sources.retrieve.private
);

export const retrieveOrgSourcesAction = createActionThunk(
    indexedAction(
        RETRIEVE_SOURCES_ACTION,
        ORG_SOURCES_ACTION_INDEX
    ),
    api.sources.retrieve.private
);

export function makeRetrieveSourceAction(useCache = false) {
    return createActionThunk(RETRIEVE_SOURCE_ACTION, api.retrieve, useCache);
};

export const retrieveSourceAndDetailsAction = (sourceUrl: string) => {
    return async (dispatch: Function) => {
        const retrieveSourceResult = await dispatch(
            makeRetrieveSourceAction(false)<APISource>(sourceUrl)
        );
        if (!retrieveSourceResult) return;
    };
};

export const retrievePublicSourcesAction = createActionThunk(
    indexedAction(
        RETRIEVE_SOURCES_ACTION,
        PUBLIC_SOURCES_ACTION_INDEX
    ),
    api.sources.retrieve.private
);
