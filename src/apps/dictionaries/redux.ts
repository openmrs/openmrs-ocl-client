import {
    completeAction,
    createActionThunk,
    loadingSelector,
    startAction,
    progressAction,
    progressSelector
} from "../../redux";
import api from "./api";
import {
    createSourceAction as createSource,
    createSourceErrorSelector, NewAPISource,
    retrieveSourceAction,
    retrieveSourceLoadingSelector
} from "../sources";
import {APIDictionary, Dictionary, DictionaryState} from "./types";
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

const CREATE_DICTIONARY_ACTION = 'dictionaries/create';
const CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION = 'dictionaries/createSourceCollectionDictionary';
const RETRIEVE_DICTIONARY_ACTION = 'dictionaries/retrieveDictionary';


const createDictionaryAction = createActionThunk(CREATE_DICTIONARY_ACTION, api.create);
const createSourceCollectionDictionaryAction = (dictionaryData: Dictionary) => {
    return async (dispatch: Function) => {
        dispatch(startAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION));

        const {
            description,
            dictionaryName,
            otherLanguages,
            ownerUrl,
            preferredLanguage,
            preferredSource,
            shortCode,
            visibility,
        } = dictionaryData;

        let sourceResponse: APISource | boolean;
        let collectionResponse: APICollection | boolean;
        let dictionaryResponse;

        dispatch(progressAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION, 'Creating source...'));
        const source: NewAPISource = {
            custom_validation_schema: CUSTOM_VALIDATION_SCHEMA,
            default_locale: preferredLanguage,
            description: description,
            external_id: uuid(),
            full_name: `${dictionaryName} Source`,
            name: `${dictionaryName} Source`,
            public_access: 'None',
            short_code: `${shortCode}Source`,
            id: `${shortCode}Source`,
            source_type: "OCL Client Source",
            supported_locales: otherLanguages.join(','),
            website: ""
        };
        sourceResponse = await dispatch(createSource<NewAPISource>(ownerUrl, source));
        if (!sourceResponse){
            dispatch(completeAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION));
            return false;
        }


        dispatch(progressAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION, 'Creating collection...'));
        const collection: NewAPICollection = {
            collection_type: "OCL Client Collection",
            custom_validation_schema: CUSTOM_VALIDATION_SCHEMA,
            default_locale: preferredLanguage,
            description: description,
            external_id: uuid(),
            full_name: `${dictionaryName} Collection`,
            name: `${dictionaryName} Collection`,
            public_access: 'None',
            id: `${shortCode}Collection`,
            short_code: `${shortCode}Collection`,
            supported_locales: otherLanguages.join(','),
            website: ""
        };
        collectionResponse = await dispatch(createCollection<NewAPICollection>(ownerUrl, collection));
        if (!collectionResponse){ // todo cleanup here would involve hard deleting the source
            dispatch(completeAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION));
            return false;
        }


        dispatch(progressAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION, 'Creating dictionary...'));
        const dictionary: APIDictionary = {
            collection_type: "OCL Client Dictionary",
            custom_validation_schema: CUSTOM_VALIDATION_SCHEMA,
            default_locale: preferredLanguage,
            description: description,
            external_id: uuid(),
            extras: {
                source: (sourceResponse as APISource).url,
                collection: (collectionResponse as APICollection).url,
            },
            preferred_source: preferredSource,
            full_name: dictionaryName,
            name: dictionaryName,
            public_access: visibility,
            id: shortCode,
            short_code: shortCode,
            supported_locales: otherLanguages.join(','),
            website: ""
        };
        dictionaryResponse = await dispatch(createDictionaryAction<APIDictionary>(ownerUrl, dictionary));
        if (!dictionaryResponse) { // todo cleanup here would involve hard deleting the source and collection
            dispatch(completeAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION));
            return false;
        }

        dispatch(completeAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION));
    }
};
const retrieveDictionaryAction = createActionThunk(RETRIEVE_DICTIONARY_ACTION, api.retrieve);
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

const initialState: DictionaryState = {

};

const reducer = (state=initialState, action: AnyAction) => {
    switch (action.type) {
        case startAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION).type:
            return {...state, newDictionary: undefined};
        case CREATE_DICTIONARY_ACTION:
            return {...state, newDictionary: action.payload};
        case RETRIEVE_DICTIONARY_ACTION:
            return {...state, dictionary: action.payload};
        default:
            return state;
    }
};

const createDictionaryLoadingSelector = loadingSelector(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION);
const createDictionaryProgressSelector = progressSelector(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION);
const createDictionaryErrorSelector = errorSelector(CREATE_DICTIONARY_ACTION);
const createSourceCollectionDictionaryErrorsSelector = (state: AppState): ({[key: string]: string[] | undefined} | undefined) => {
  const createSourceErrors = createSourceErrorSelector(state);
  if (createSourceErrors) return createSourceErrors;

  const createCollectionErrors = createCollectionErrorSelector(state);
  if (createCollectionErrors) return createCollectionErrors;

    const createDictionaryErrors = createDictionaryErrorSelector(state);
    if (createDictionaryErrors) return createDictionaryErrors;
};

const retrieveDictionaryLoadingSelector = loadingSelector(RETRIEVE_DICTIONARY_ACTION);
const retrieveDictionaryDetailsLoadingSelector = (state: AppState) => retrieveCollectionLoadingSelector(state) || retrieveSourceLoadingSelector(state);

export {
    reducer as default,
    createSourceCollectionDictionaryAction,
    createDictionaryLoadingSelector,
    createDictionaryProgressSelector,
    createSourceCollectionDictionaryErrorsSelector,
    retrieveDictionaryLoadingSelector,
    retrieveDictionaryDetailsLoadingSelector,
    retrieveDictionaryAndDetailsAction,
};
