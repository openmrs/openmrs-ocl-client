import {
  completeAction,
  createActionThunk,
  FAILURE,
  indexedAction,
  progressAction,
  startAction
} from "../../../redux";
import api from "../api";
import { APIDictionary, Dictionary, NewAPIDictionary } from "../types";
import {
  APISource,
  createSourceAction as createSource,
  editSourceAction as editSource,
  NewAPISource
} from "../../sources";
import {
  CUSTOM_VALIDATION_SCHEMA,
  EditableConceptContainerFields
} from "../../../utils";
import uuid from "uuid/v4";
import { OCL_DICTIONARY_TYPE, OCL_SOURCE_TYPE } from "../constants";
import {
  ORG_DICTIONARIES_ACTION_INDEX,
  PERSONAL_DICTIONARIES_ACTION_INDEX
} from "./constants";
import { APIConcept } from "../../concepts";
import { CIEL_CONCEPTS_URL } from "../../concepts/constants";
import { recursivelyFetchToConcepts } from "../logic";
import { addConceptsToDictionaryProgressListSelector } from "./selectors";
import {
  ADD_CONCEPTS_TO_DICTIONARY,
  CREATE_DICTIONARY_ACTION,
  CREATE_DICTIONARY_VERSION_ACTION,
  CREATE_SOURCE_AND_DICTIONARY_ACTION,
  EDIT_DICTIONARY_ACTION,
  EDIT_SOURCE_AND_DICTIONARY_ACTION,
  REMOVE_REFERENCES_FROM_DICTIONARY,
  RETRIEVE_DICTIONARIES_ACTION,
  RETRIEVE_DICTIONARY_ACTION,
  RETRIEVE_DICTIONARY_VERSIONS_ACTION
} from "./actionTypes";

const createDictionaryAction = createActionThunk(
  indexedAction(CREATE_DICTIONARY_ACTION),
  api.create
);
export const createSourceAndDictionaryAction = (dictionaryData: Dictionary) => {
  return async (dispatch: Function) => {
    dispatch(startAction(indexedAction(CREATE_SOURCE_AND_DICTIONARY_ACTION)));

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
        indexedAction(CREATE_SOURCE_AND_DICTIONARY_ACTION),
        "Creating source..."
      )
    );
    const source: NewAPISource = {
      custom_validation_schema: CUSTOM_VALIDATION_SCHEMA,
      default_locale,
      description,
      external_id: uuid(),
      full_name: name,
      name: name,
      public_access: "None",
      short_code: short_code,
      id: short_code,
      source_type: OCL_SOURCE_TYPE,
      supported_locales: supported_locales.join(","),
      website: ""
    };
    sourceResponse = await dispatch(createSource<APISource>(owner_url, source));
    if (!sourceResponse) {
      dispatch(
        completeAction(indexedAction(CREATE_SOURCE_AND_DICTIONARY_ACTION))
      );
      return false;
    }

    dispatch(
      progressAction(
        indexedAction(CREATE_SOURCE_AND_DICTIONARY_ACTION),
        "Creating dictionary..."
      )
    );

    dispatch(
      progressAction(
        indexedAction(CREATE_SOURCE_AND_DICTIONARY_ACTION),
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
        source: (sourceResponse as APISource).url
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
      // todo cleanup here would involve hard deleting the source
      dispatch(
        completeAction(indexedAction(CREATE_SOURCE_AND_DICTIONARY_ACTION))
      );
      return false;
    }

    dispatch(
      completeAction(indexedAction(CREATE_SOURCE_AND_DICTIONARY_ACTION))
    );
  };
};
export const retrieveDictionaryAction = createActionThunk(
  RETRIEVE_DICTIONARY_ACTION,
  api.retrieve
);
export const retrieveDictionaryAndDetailsAction = (dictionaryUrl: string) => {
  return async (dispatch: Function) => {
    const retrieveDictionaryResult = await dispatch(
      retrieveDictionaryAction<APIDictionary>(dictionaryUrl)
    );
    if (!retrieveDictionaryResult || !retrieveDictionaryResult.extras) return;

    dispatch(retrieveDictionaryVersionsAction(dictionaryUrl));
  };
};
export const retrievePublicDictionariesAction = createActionThunk(
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
export const retrieveDictionariesAction = (
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
export const editSourceAndDictionaryAction = (
  dictionaryUrl: string,
  dictionaryData: Dictionary,
  extras: { source: string }
) => {
  return async (dispatch: Function) => {
    dispatch(startAction(indexedAction(EDIT_SOURCE_AND_DICTIONARY_ACTION)));

    const {
      description,
      name,
      supported_locales,
      default_locale,
      preferred_source,
      public_access
    } = dictionaryData;

    const data: EditableConceptContainerFields = {
      // we are not updating source visibility for now, as it is staying private
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
        indexedAction(EDIT_SOURCE_AND_DICTIONARY_ACTION),
        "Editing source..."
      )
    );
    sourceResponse = await dispatch(editSource<APISource>(extras.source, data));
    if (!sourceResponse) {
      dispatch(
        completeAction(indexedAction(EDIT_SOURCE_AND_DICTIONARY_ACTION))
      );
      return false;
    }

    dispatch(
      progressAction(
        indexedAction(EDIT_SOURCE_AND_DICTIONARY_ACTION),
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
      // todo cleanup here would involve undoing the source update
      dispatch(
        completeAction(indexedAction(EDIT_SOURCE_AND_DICTIONARY_ACTION))
      );
      return false;
    }

    dispatch(completeAction(indexedAction(EDIT_SOURCE_AND_DICTIONARY_ACTION)));
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
export const createDictionaryVersionAction = createActionThunk(
  CREATE_DICTIONARY_VERSION_ACTION,
  api.versions.create
);

export const addCIELConceptsToDictionaryAction = (
  dictionaryUrl: string,
  rawConcepts: (APIConcept | string)[],
  bulk: boolean = false
) => async (dispatch: Function, getState: Function) => {
  const concepts = rawConcepts.map(concept =>
    typeof concept === "string"
      ? {
          id: concept,
          url: `${CIEL_CONCEPTS_URL}${concept}/`,
          display_name: concept
        }
      : concept
  );
  const conceptOrConcepts =
    concepts.length > 1 ? `concepts (${concepts.length})` : "concept";
  const thisOrThese = concepts.length > 1 ? "these" : "this";
  const actionIndex =
    addConceptsToDictionaryProgressListSelector(getState())?.length || 0;
  const updateProgress = (message: string) => {
    const headerMessage = concepts
      .map(concept => concept.display_name)
      .join(", ");
    dispatch(
      progressAction(
        indexedAction(ADD_CONCEPTS_TO_DICTIONARY, actionIndex),
        `Adding ${conceptOrConcepts}: ${headerMessage}--${message}`
      )
    );
  };

  dispatch(startAction(indexedAction(ADD_CONCEPTS_TO_DICTIONARY, actionIndex)));

  const referencesToAdd = await recursivelyFetchToConcepts(
    concepts.map(concept => concept.id),
    updateProgress
  );
  updateProgress(
    referencesToAdd.length
      ? `Adding ${thisOrThese} and ${referencesToAdd.length} dependent concepts...`
      : `Adding ${conceptOrConcepts}...`
  );

  try {
    const response = await api.references.add(dictionaryUrl, [
      ...referencesToAdd,
      ...concepts.map(concept => concept.url)
    ]);
    dispatch({
      type: ADD_CONCEPTS_TO_DICTIONARY,
      actionIndex: actionIndex,
      payload: response.data,
      meta: [dictionaryUrl, concepts, bulk]
    });
    updateProgress(`Added ${conceptOrConcepts}`);
  } catch (e) {
    dispatch({
      type: `${ADD_CONCEPTS_TO_DICTIONARY}_${FAILURE}`,
      actionIndex: actionIndex,
      payload: e.response?.data,
      meta: [dictionaryUrl, concepts, bulk]
    });
  }

  dispatch(
    completeAction(indexedAction(ADD_CONCEPTS_TO_DICTIONARY, actionIndex))
  );
};
export const addConceptsToDictionaryAction = createActionThunk(
  indexedAction(ADD_CONCEPTS_TO_DICTIONARY, 100),
  api.references.add
);
export const removeReferencesFromDictionaryAction = createActionThunk(
  REMOVE_REFERENCES_FROM_DICTIONARY,
  api.references.delete
);
