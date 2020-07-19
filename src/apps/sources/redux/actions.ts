import {createActionThunk, indexedAction} from "../../../redux";
import {CREATE_SOURCE_ACTION, EDIT_SOURCE_ACTION, RETRIEVE_SOURCES_ACTION} from "./actionTypes";
import api from "../api";
import {ORG_SOURCES_ACTION_INDEX, PERSONAL_SOURCES_ACTION_INDEX} from "./constants";

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

