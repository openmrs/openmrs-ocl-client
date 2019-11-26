import {
    completeAction,
    createActionThunk,
    loadingSelector,
    startAction,
    progressAction,
    progressSelector, indexedAction
} from '../../redux'
import api from "./api";
import {
    createSourceAction as createSource,
    createSourceErrorSelector, NewAPISource,
    retrieveSourceAction,
    retrieveSourceLoadingSelector
} from "../sources";
import { APIDictionary, Dictionary, DictionaryState, NewAPIDictionary } from './types'
import {APISource} from "../sources";
import {CUSTOM_VALIDATION_SCHEMA} from "../../utils";
import uuid from "uuid/v4";
import {APICollection, NewAPICollection} from "../collections";
import {
    createCollectionAction as createCollection,
    createCollectionErrorSelector,
    retrieveCollectionAction, retrieveCollectionLoadingSelector
} from "../collections";
import {AnyAction} from "redux";
import {AppState} from "../../redux";
import {errorSelector} from "../../redux/redux";
import { OCL_DICTIONARY_TYPE } from './constants'

const CREATE_DICTIONARY_ACTION = 'dictionaries/create';
const CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION = 'dictionaries/createSourceCollectionDictionary';
const RETRIEVE_DICTIONARY_ACTION = 'dictionaries/retrieveDictionary';
const RETRIEVE_DICTIONARIES_ACTION = 'dictionaries/retrieveDictionaries';


const createDictionaryAction = createActionThunk(indexedAction(CREATE_DICTIONARY_ACTION), api.create);
const createSourceCollectionDictionaryAction = (dictionaryData: Dictionary) => {
    return async (dispatch: Function) => {
        dispatch(startAction(indexedAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION)));

        const {
            description,
            name,
            supported_locales,
            owner_url,
            default_locale,
            preferred_source,
            short_code,
            public_access,
        } = dictionaryData;

        let sourceResponse: APISource | boolean;
        let collectionResponse: APICollection | boolean;
        let dictionaryResponse;

        dispatch(progressAction(indexedAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION), 'Creating source...'));
        const source: NewAPISource = {
            custom_validation_schema: CUSTOM_VALIDATION_SCHEMA,
            default_locale: default_locale,
            description: description,
            external_id: uuid(),
            full_name: `${name} Source`,
            name: `${name} Source`,
            public_access: 'None',
            short_code: `${short_code}Source`,
            id: `${short_code}Source`,
            source_type: "OCL Client Source",
            supported_locales: supported_locales.join(','),
            website: ""
        };
        sourceResponse = await dispatch(createSource<NewAPISource>(owner_url, source));
        if (!sourceResponse) {
            dispatch(completeAction(indexedAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION)));
            return false;
        }


        dispatch(progressAction(indexedAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION), 'Creating collection...'));
        const collection: NewAPICollection = {
            collection_type: "OCL Client Collection",
            custom_validation_schema: CUSTOM_VALIDATION_SCHEMA,
            default_locale: default_locale,
            description: description,
            external_id: uuid(),
            full_name: `${name} Collection`,
            name: `${name} Collection`,
            public_access: 'None',
            id: `${short_code}Collection`,
            short_code: `${short_code}Collection`,
            supported_locales: supported_locales.join(','),
            website: ""
        };
        collectionResponse = await dispatch(createCollection<NewAPICollection>(owner_url, collection));
        if (!collectionResponse) { // todo cleanup here would involve hard deleting the source
            dispatch(completeAction(indexedAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION)));
            return false;
        }


        dispatch(progressAction(indexedAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION), 'Creating dictionary...'));
        const dictionary: NewAPIDictionary = {
            collection_type: OCL_DICTIONARY_TYPE,
            custom_validation_schema: CUSTOM_VALIDATION_SCHEMA,
            default_locale: default_locale,
            description: description,
            external_id: uuid(),
            extras: {
                source: (sourceResponse as APISource).url,
                collection: (collectionResponse as APICollection).url,
            },
            preferred_source: preferred_source,
            full_name: name,
            name: name,
            public_access: public_access,
            id: short_code,
            short_code: short_code,
            supported_locales: supported_locales.join(','),
            website: ""
        };
        dictionaryResponse = await dispatch(createDictionaryAction<APIDictionary>(owner_url, dictionary));
        if (!dictionaryResponse) { // todo cleanup here would involve hard deleting the source and collection
            dispatch(completeAction(indexedAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION)));
            return false;
        }

        dispatch(completeAction(indexedAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION)));
    }
};
const retrieveDictionaryAction = createActionThunk(indexedAction(RETRIEVE_DICTIONARY_ACTION), api.retrieve);
const retrieveDictionaryAndDetailsAction = (dictionaryUrl: string) => {
    return async (dispatch: Function) => {
        const retrieveDictionaryResult = await dispatch(retrieveDictionaryAction<APIDictionary>(dictionaryUrl));
        if (!retrieveDictionaryResult || !retrieveDictionaryResult.extras) return;

        await Promise.all([
            dispatch(retrieveSourceAction(retrieveDictionaryResult.extras.source)),
            dispatch(retrieveCollectionAction(retrieveDictionaryResult.extras.collection)),
        ]);
    }
};
const retrieveDictionariesAction = createActionThunk(RETRIEVE_DICTIONARIES_ACTION, api.dictionaries.retrieve);

const initialState: DictionaryState = {};

const reducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case startAction(indexedAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION)).type:
            return {...state, newDictionary: undefined};
        case CREATE_DICTIONARY_ACTION:
            return {...state, newDictionary: action.payload};
        case RETRIEVE_DICTIONARY_ACTION:
            return {...state, dictionary: action.payload};
        case RETRIEVE_DICTIONARIES_ACTION:
            return {...state, dictionaries: {items: action.payload, responseMeta: action.responseMeta}};
        default:
            return state;
    }
};

const createDictionaryLoadingSelector = loadingSelector(indexedAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION));
const createDictionaryProgressSelector = progressSelector(indexedAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION));
const createDictionaryErrorSelector = errorSelector(indexedAction(CREATE_DICTIONARY_ACTION));
const createSourceCollectionDictionaryErrorsSelector = (state: AppState): ({ [key: string]: string[] | undefined } | undefined) => {
    const createSourceErrors = createSourceErrorSelector(state);
    if (createSourceErrors) return createSourceErrors;

    const createCollectionErrors = createCollectionErrorSelector(state);
    if (createCollectionErrors) return createCollectionErrors;

    const createDictionaryErrors = createDictionaryErrorSelector(state);
    if (createDictionaryErrors) return createDictionaryErrors;
};

const retrieveDictionaryLoadingSelector = loadingSelector(indexedAction(RETRIEVE_DICTIONARY_ACTION));
const retrieveDictionaryDetailsLoadingSelector = (state: AppState) => retrieveCollectionLoadingSelector(state) || retrieveSourceLoadingSelector(state);
const retrieveDictionariesLoadingSelector = loadingSelector(indexedAction(RETRIEVE_DICTIONARIES_ACTION));

export {
    reducer as default,
    createSourceCollectionDictionaryAction,
    createDictionaryLoadingSelector,
    createDictionaryProgressSelector,
    createSourceCollectionDictionaryErrorsSelector,
    retrieveDictionaryLoadingSelector,
    retrieveDictionaryDetailsLoadingSelector,
    retrieveDictionaryAndDetailsAction,
    retrieveDictionariesAction,
    retrieveDictionariesLoadingSelector,
};
