import {
  completeAction,
  createActionThunk,
  loadingSelector,
  startAction,
  progressAction,
  progressSelector,
  indexedAction
} from "../../redux";
import api from "./api";
import {
  createSourceAction as createSource,
  createSourceErrorSelector,
  NewAPISource,
  retrieveSourceAction,
  retrieveSourceLoadingSelector,
  editSourceAction as editSource,
  editSourceErrorSelector
} from "../sources";
import {
  APIDictionary,
  Dictionary,
  DictionaryState,
  NewAPIDictionary
} from "./types";
import { APISource } from "../sources";
import {
  CUSTOM_VALIDATION_SCHEMA,
  EditableConceptContainerFields
} from "../../utils";
import uuid from "uuid/v4";
import { AppState } from "../../redux";
import { errorSelector } from "../../redux/redux";
import {
  OCL_DICTIONARY_TYPE,
  OCL_SOURCE_TYPE
} from "./constants";
import { createReducer } from "@reduxjs/toolkit";
import { Action } from "../../redux/utils";

const PERSONAL_DICTIONARIES_ACTION_INDEX = 1;
const ORG_DICTIONARIES_ACTION_INDEX = 2;

const CREATE_DICTIONARY_ACTION = "dictionaries/create";
const CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION =
  "dictionaries/createSourceCollectionDictionary";
const RETRIEVE_DICTIONARY_ACTION = "dictionaries/retrieveDictionary";
const RETRIEVE_DICTIONARIES_ACTION = "dictionaries/retrieveDictionaries";
const EDIT_SOURCE_COLLECTION_DICTIONARY_ACTION =
  "dictionaries/editSourceCollectionDictionary";
const EDIT_DICTIONARY_ACTION = "dictionaries/edit";
const RETRIEVE_DICTIONARY_VERSIONS_ACTION = "dictionaries/retrieveVersions";

const createDictionaryAction = createActionThunk(
  indexedAction(CREATE_DICTIONARY_ACTION),
  api.create
);
const createSourceAndDictionaryAction = (dictionaryData: Dictionary) => {
  return async (dispatch: Function) => {
    dispatch(
      startAction(indexedAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION))
    );

    const {
      description,
      name,
      supported_locales,
      owner_url,
      default_locale,
      preferred_source,
      short_code,
      public_access
    } = dictionaryData;

    let sourceResponse: APISource | boolean;
    let dictionaryResponse;

    dispatch(
      progressAction(
        indexedAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION),
        "Creating source..."
      )
    );
    const source: NewAPISource = {
      custom_validation_schema: CUSTOM_VALIDATION_SCHEMA,
      default_locale,
      description,
      external_id: uuid(),
      full_name: `${name} Source`,
      name: `${name} Source`,
      public_access: "None",
      short_code: `${short_code}Source`,
      id: `${short_code}Source`,
      source_type: OCL_SOURCE_TYPE,
      supported_locales: supported_locales.join(","),
      website: ""
    };
    sourceResponse = await dispatch(createSource<APISource>(owner_url, source));
    if (!sourceResponse) {
      dispatch(
        completeAction(
          indexedAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION)
        )
      );
      return false;
    }

    dispatch(
      progressAction(
        indexedAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION),
        "Creating collection..."
      )
    );

    dispatch(
      progressAction(
        indexedAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION),
        "Creating dictionary..."
      )
    );
    const dictionary: NewAPIDictionary = {
      collection_type: OCL_DICTIONARY_TYPE,
      custom_validation_schema: CUSTOM_VALIDATION_SCHEMA,
      default_locale,
      description,
      external_id: uuid(),
      extras: {
        source: (sourceResponse as APISource).url,
      },
      preferred_source: preferred_source,
      full_name: name,
      name,
      public_access: public_access,
      id: short_code,
      short_code,
      supported_locales: supported_locales.join(","),
      website: ""
    };
    dictionaryResponse = await dispatch(
      createDictionaryAction<APIDictionary>(owner_url, dictionary)
    );
    if (!dictionaryResponse) {
      // todo cleanup here would involve hard deleting the source and collection
      dispatch(
        completeAction(
          indexedAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION)
        )
      );
      return false;
    }

    dispatch(
      completeAction(indexedAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION))
    );
  };
};
const retrieveDictionaryAction = createActionThunk(
  RETRIEVE_DICTIONARY_ACTION,
  api.retrieve
);
const retrieveDictionaryAndDetailsAction = (dictionaryUrl: string) => {
  return async (dispatch: Function) => {
    const retrieveDictionaryResult = await dispatch(
      retrieveDictionaryAction<APIDictionary>(dictionaryUrl)
    );
    if (!retrieveDictionaryResult || !retrieveDictionaryResult.extras) return;

    dispatch(retrieveDictionaryVersionsAction(dictionaryUrl));
  };
};
const retrievePublicDictionariesAction = createActionThunk(
  RETRIEVE_DICTIONARIES_ACTION,
  api.dictionaries.retrieve.public
);
const retrievePersonalDictionariesAction = createActionThunk(
  indexedAction(
    RETRIEVE_DICTIONARIES_ACTION,
    PERSONAL_DICTIONARIES_ACTION_INDEX
  ),
  api.dictionaries.retrieve.private
);
const retrieveOrgDictionariesAction = createActionThunk(
  indexedAction(RETRIEVE_DICTIONARIES_ACTION, ORG_DICTIONARIES_ACTION_INDEX),
  api.dictionaries.retrieve.private
);
const retrieveDictionariesAction = (
  personalDictionariesUrl: string,
  personalQ: string = "",
  personalLimit = 20,
  personalPage = 1,
  orgDictionariesUrl: string,
  orgQ: string = "",
  orgLimit = 20,
  orgPage = 1
) => {
  // Yes, we would have loved for these to be individual actions, but I encountered a weird race condition issue
  // Backend mixes up results for the two calls when they are started simultaneously
  return async (dispatch: Function) => {
    await dispatch(
      retrievePersonalDictionariesAction(
        personalDictionariesUrl,
        personalQ,
        personalLimit,
        personalPage
      )
    );
    await dispatch(
      retrieveOrgDictionariesAction(orgDictionariesUrl, orgQ, orgLimit, orgPage)
    );
  };
};
const editSourceAndDictionaryAction = (
  dictionaryUrl: string,
  dictionaryData: Dictionary,
  extras: { source: string; collection: string }
) => {
  return async (dispatch: Function) => {
    dispatch(
      startAction(indexedAction(EDIT_SOURCE_COLLECTION_DICTIONARY_ACTION))
    );

    const {
      description,
      name,
      supported_locales,
      default_locale,
      preferred_source,
      public_access
    } = dictionaryData;

    const data: EditableConceptContainerFields = {
      // we are not updating source and collection visibility for now, as they are staying private
      description,
      name,
      supported_locales: supported_locales.join(","),
      default_locale,
      preferred_source
    };

    let sourceResponse: APISource | boolean;
    let dictionaryResponse: APIDictionary | boolean;

    dispatch(
      progressAction(
        indexedAction(EDIT_SOURCE_COLLECTION_DICTIONARY_ACTION),
        "Editing source..."
      )
    );
    sourceResponse = await dispatch(editSource<APISource>(extras.source, data));
    if (!sourceResponse) {
      dispatch(
        completeAction(indexedAction(EDIT_SOURCE_COLLECTION_DICTIONARY_ACTION))
      );
      return false;
    }

    dispatch(
      progressAction(
        indexedAction(EDIT_SOURCE_COLLECTION_DICTIONARY_ACTION),
        "Editing collection..."
      )
    );

    dispatch(
      progressAction(
        indexedAction(EDIT_SOURCE_COLLECTION_DICTIONARY_ACTION),
        "Editing dictionary..."
      )
    );
    dictionaryResponse = await dispatch(
      editDictionaryAction<APIDictionary>(dictionaryUrl, {
        ...data,
        public_access
      })
    );
    if (!dictionaryResponse) {
      // todo cleanup here would involve hard deleting the source and collection
      dispatch(
        completeAction(indexedAction(EDIT_SOURCE_COLLECTION_DICTIONARY_ACTION))
      );
      return false;
    }

    dispatch(
      completeAction(indexedAction(EDIT_SOURCE_COLLECTION_DICTIONARY_ACTION))
    );
  };
};
const editDictionaryAction = createActionThunk(
  EDIT_DICTIONARY_ACTION,
  api.update
);
const retrieveDictionaryVersionsAction = createActionThunk(
  RETRIEVE_DICTIONARY_VERSIONS_ACTION,
  api.versions.retrieve
);

const initialState: DictionaryState = {
  dictionaries: [],
  versions: []
};

const reducer = createReducer(initialState, {
  [startAction(indexedAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION))
    .type]: state => ({
    ...state,
    newDictionary: undefined
  }),
  [CREATE_DICTIONARY_ACTION]: (state, action) => ({
    ...state,
    newDictionary: action.payload
  }),
  [RETRIEVE_DICTIONARY_ACTION]: (state, action) => ({
    ...state,
    dictionary: action.payload
  }),
  [RETRIEVE_DICTIONARIES_ACTION]: (
    state,
    { actionIndex, payload, responseMeta }: Action
  ) => {
    state.dictionaries[actionIndex] = { items: payload, responseMeta };
  },
  [startAction(indexedAction(EDIT_SOURCE_COLLECTION_DICTIONARY_ACTION))
    .type]: state => ({
    ...state,
    editedDictionary: undefined
  }),
  [EDIT_DICTIONARY_ACTION]: (state, action) => ({
    ...state,
    editedDictionary: action.payload
  }),
  [RETRIEVE_DICTIONARY_VERSIONS_ACTION]: (state, action) => ({
    ...state,
    versions: action.payload
  })
});

const createDictionaryLoadingSelector = loadingSelector(
  indexedAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION)
);
const createDictionaryProgressSelector = progressSelector(
  indexedAction(CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION)
);
const createDictionaryErrorSelector = errorSelector(
  indexedAction(CREATE_DICTIONARY_ACTION)
);
const editDictionaryErrorSelector = errorSelector(
  indexedAction(EDIT_DICTIONARY_ACTION)
);
const editDictionaryLoadingSelector = loadingSelector(
  indexedAction(EDIT_SOURCE_COLLECTION_DICTIONARY_ACTION)
);
const editDictionaryProgressSelector = progressSelector(
  indexedAction(EDIT_SOURCE_COLLECTION_DICTIONARY_ACTION)
);
const createSourceCollectionDictionaryErrorsSelector = (
  state: AppState
): { [key: string]: string[] | undefined } | undefined => {
  const createSourceErrors = createSourceErrorSelector(state);
  if (createSourceErrors) return createSourceErrors;

  const createDictionaryErrors = createDictionaryErrorSelector(state);
  if (createDictionaryErrors) return createDictionaryErrors;
};
const editSourceCollectionDictionaryErrorsSelector = (
  state: AppState
): { [key: string]: string[] | undefined } | undefined => {
  const editSourceErrors = editSourceErrorSelector(state);
  if (editSourceErrors) return editSourceErrors;

  const editDictionaryErrors = editDictionaryErrorSelector(state);
  if (editDictionaryErrors) return editDictionaryErrors;
};

const retrieveDictionaryLoadingSelector = loadingSelector(
  indexedAction(RETRIEVE_DICTIONARY_ACTION)
);
const retrieveDictionaryVersionLoadingSelector = loadingSelector(
  indexedAction(RETRIEVE_DICTIONARY_VERSIONS_ACTION)
);

const retrievePublicDictionariesLoadingSelector = loadingSelector(
  indexedAction(RETRIEVE_DICTIONARIES_ACTION)
);
const retrieveDictionariesLoadingSelector = loadingSelector(
  indexedAction(
    RETRIEVE_DICTIONARIES_ACTION,
    PERSONAL_DICTIONARIES_ACTION_INDEX
  ),
  indexedAction(RETRIEVE_DICTIONARIES_ACTION, ORG_DICTIONARIES_ACTION_INDEX)
);

export {
  reducer as default,
  createSourceAndDictionaryAction,
  createDictionaryLoadingSelector,
  createDictionaryProgressSelector,
  createSourceCollectionDictionaryErrorsSelector,
  retrieveDictionaryLoadingSelector,
  retrieveDictionaryAndDetailsAction,
  retrievePublicDictionariesAction,
  retrieveDictionariesAction,
  retrievePublicDictionariesLoadingSelector,
  retrieveDictionariesLoadingSelector,
  PERSONAL_DICTIONARIES_ACTION_INDEX,
  ORG_DICTIONARIES_ACTION_INDEX,
  retrieveDictionaryAction,
  editSourceAndDictionaryAction,
  editSourceCollectionDictionaryErrorsSelector,
  editDictionaryProgressSelector,
  editDictionaryLoadingSelector,
  retrieveDictionaryVersionLoadingSelector
};
