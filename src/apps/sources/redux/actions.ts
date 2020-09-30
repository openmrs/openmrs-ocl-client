import {createActionThunk, indexedAction} from "../../../redux";
import {CREATE_SOURCE_ACTION, EDIT_SOURCE_ACTION, RETRIEVE_SOURCE_ACTION, RETRIEVE_SOURCES_ACTION} from "./actionTypes";
import api from "../api";
import {ORG_SOURCES_ACTION_INDEX, PERSONAL_SOURCES_ACTION_INDEX, PUBLIC_SOURCES_ACTION_INDEX} from "./constants";
import {APISource, NewAPISource} from "../types";
import {CUSTOM_VALIDATION_SCHEMA} from "../../../utils";
import uuid from "uuid";

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
    api.sources.retrieve.public
);
export const createSourceDispatchAction = (sourceData: APISource) => {

        const {
            description,
            name,
            supported_locales,
            default_locale,
            short_code,
            owner_url,
            public_access,
            source_type
        } = sourceData;


        const source: NewAPISource = {
            custom_validation_schema: CUSTOM_VALIDATION_SCHEMA,
            default_locale,
            description,
            external_id: uuid(),
            full_name: name,
            name: name,
            public_access: public_access,
            short_code: short_code,
            id: short_code,
            source_type:source_type,
            supported_locales: supported_locales.join(","),
            owner_url: owner_url
        };

     return async (dispatch: Function) => {
         dispatch(createSourceAction<APISource>(owner_url, source))
     };
};



