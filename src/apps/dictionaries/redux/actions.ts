import {
  completeAction,
  createActionThunk,
  FAILURE,
  indexedAction,
  progressAction,
  startAction,
  resetAction
} from "../../../redux";
import api from "../api";
import { flatten, groupBy, includes } from "lodash";
import {
  APIDictionary,
  Dictionary,
  NewAPIDictionary,
  ImportMetaData
} from "../types";
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
import { v4 as uuid } from "uuid";
import {
  ORG_DICTIONARIES_ACTION_INDEX,
  PERSONAL_DICTIONARIES_ACTION_INDEX
} from "./constants";
import { APIConcept } from "../../concepts";
import { recursivelyFetchToConcepts } from "../logic";
import { addConceptsToDictionaryProgressListSelector } from "./selectors";
import {
  ADD_CONCEPTS_TO_DICTIONARY,
  CREATE_AND_ADD_LINKED_SOURCE_ACTION,
  CREATE_DICTIONARY_ACTION,
  CREATE_DICTIONARY_VERSION_ACTION,
  EDIT_DICTIONARY_VERSION_ACTION,
  CREATE_SOURCE_AND_DICTIONARY_ACTION,
  EDIT_DICTIONARY_ACTION,
  EDIT_SOURCE_AND_DICTIONARY_ACTION,
  REMOVE_REFERENCES_FROM_DICTIONARY,
  RETRIEVE_DICTIONARIES_ACTION,
  RETRIEVE_DICTIONARY_ACTION,
  RETRIEVE_DICTIONARY_VERSIONS_ACTION,
  TOGGLE_SHOW_VERIFIED_ACTION
} from "./actionTypes";
import { invalidateCache } from "../../../redux/utils";
import {
  addToLocalStorageObject,
  createLocalStorageObject,
  updateLocalStorageArray
} from "../../../redux/localStorageUtils";
import dayjs from "dayjs";

const createDictionaryAction = createActionThunk(
  CREATE_DICTIONARY_ACTION,
  api.create
);

export const addConceptsToDictionaryAction = createActionThunk(
  // 100 was chosen arbitrarily because this is an indexed action and we need to to slot it in somewhere.
  // it is unlikely to bite us but in the event that it does, we can always create another action type.
  indexedAction(ADD_CONCEPTS_TO_DICTIONARY, 100),
  api.references.add
);

export const createSourceAndDictionaryAction = (
  dictionaryData: Dictionary,
  references?: { [key: string]: string }[]
) => {
  return async (dispatch: Function) => {
    dispatch(startAction(CREATE_SOURCE_AND_DICTIONARY_ACTION));

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
      progressAction(CREATE_SOURCE_AND_DICTIONARY_ACTION, "Creating source...")
    );
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
      supported_locales: supported_locales?.join(","),
      website: "",
      owner_url: owner_url,
      source_type: "Dictionary"
    };
    sourceResponse = await dispatch(createSource<APISource>(owner_url, source));
    if (!sourceResponse) {
      dispatch(completeAction(CREATE_SOURCE_AND_DICTIONARY_ACTION));
      return false;
    }

    dispatch(
      progressAction(
        CREATE_SOURCE_AND_DICTIONARY_ACTION,
        "Creating dictionary..."
      )
    );

    dispatch(
      progressAction(
        CREATE_SOURCE_AND_DICTIONARY_ACTION,
        "Creating dictionary..."
      )
    );
    const dictionary: NewAPIDictionary = {
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
      website: "",
      collection_type: "Dictionary"
    };
    dictionaryResponse = await dispatch(
      createDictionaryAction<APIDictionary>(owner_url, dictionary)
    );
    const { url } = dictionaryResponse;

    const refs = references?.map(r => r.expression);
    await dispatch(addConceptsToDictionaryAction(url, refs));

    if (!dictionaryResponse) {
      // todo cleanup here would involve hard deleting the source
      dispatch(completeAction(CREATE_SOURCE_AND_DICTIONARY_ACTION));
      return false;
    }

    dispatch(completeAction(CREATE_SOURCE_AND_DICTIONARY_ACTION));
  };
};

export function makeRetrieveDictionaryAction(useCache = false) {
  return createActionThunk(RETRIEVE_DICTIONARY_ACTION, api.retrieve, useCache);
}
export const resetCreateDictionaryAction = () => {
  return (dispatch: Function) => {
    dispatch(resetAction(CREATE_SOURCE_AND_DICTIONARY_ACTION));
    dispatch(resetAction(CREATE_DICTIONARY_ACTION));
  };
};
export const resetEditDictionaryAction = () => {
  return (dispatch: Function) => {
    dispatch(resetAction(EDIT_SOURCE_AND_DICTIONARY_ACTION));
    dispatch(resetAction(EDIT_DICTIONARY_ACTION));
  };
};
export const resetRetrieveDictionaryAndDetailsAction = () => {
  return (dispatch: Function) => {
    dispatch(resetAction(RETRIEVE_DICTIONARY_ACTION));
    dispatch(resetAction(RETRIEVE_DICTIONARY_VERSIONS_ACTION));
  };
};

export const retrieveDictionaryAndDetailsAction = (dictionaryUrl: string) => {
  return async (dispatch: Function) => {
    const retrieveDictionaryResult = await dispatch(
      makeRetrieveDictionaryAction(false)<APIDictionary>(dictionaryUrl)
    );
    if (!retrieveDictionaryResult) return;

    dispatch(retrieveDictionaryVersionsAction(dictionaryUrl));
  };
};
export const retrievePublicDictionariesAction = createActionThunk(
  RETRIEVE_DICTIONARIES_ACTION,
  api.dictionaries.retrieve.public
);
export const retrievePersonalDictionariesAction = createActionThunk(
  indexedAction(
    RETRIEVE_DICTIONARIES_ACTION,
    PERSONAL_DICTIONARIES_ACTION_INDEX
  ),
  api.dictionaries.retrieve.private
);
export const retrieveOrgDictionariesAction = createActionThunk(
  indexedAction(RETRIEVE_DICTIONARIES_ACTION, ORG_DICTIONARIES_ACTION_INDEX),
  api.dictionaries.retrieve.private
);
export const editSourceAndDictionaryAction = (
  dictionaryUrl: string,
  dictionaryData: Dictionary,
  linkedSource?: string
) => {
  return async (dispatch: Function) => {
    dispatch(startAction(EDIT_SOURCE_AND_DICTIONARY_ACTION));

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
      preferred_source,
      public_access
    };

    if (linkedSource) {
      let sourceResponse: APISource | boolean;

      dispatch(
        progressAction(EDIT_SOURCE_AND_DICTIONARY_ACTION, "Editing source...")
      );
      sourceResponse = await dispatch(
        editSource<APISource>(linkedSource, data)
      );
      if (!sourceResponse) {
        dispatch(completeAction(EDIT_SOURCE_AND_DICTIONARY_ACTION));
        return false;
      }
    }

    let dictionaryResponse: APIDictionary | boolean;

    dispatch(
      progressAction(EDIT_SOURCE_AND_DICTIONARY_ACTION, "Editing dictionary...")
    );
    dictionaryResponse = await dispatch(
      editDictionaryAction<APIDictionary>(dictionaryUrl, {
        ...data,
        public_access
      })
    );
    if (!dictionaryResponse) {
      // todo cleanup here would involve undoing the source update
      dispatch(completeAction(EDIT_SOURCE_AND_DICTIONARY_ACTION));
      return false;
    }

    invalidateCache(RETRIEVE_DICTIONARY_ACTION, dispatch);
    dispatch(completeAction(EDIT_SOURCE_AND_DICTIONARY_ACTION));
  };
};
export const createAndAddLinkedSourceAction = (
  dictionaryUrl: string,
  dictionaryData: Dictionary
) => {
  return async (dispatch: Function) => {
    dispatch(startAction(CREATE_AND_ADD_LINKED_SOURCE_ACTION));

    const {
      description,
      name,
      supported_locales,
      owner_url,
      default_locale,
      short_code,
      public_access
    } = dictionaryData;

    let sourceResponse: APISource | boolean;

    dispatch(
      progressAction(CREATE_AND_ADD_LINKED_SOURCE_ACTION, "Creating source...")
    );
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
      supported_locales: supported_locales.join(","),
      website: "",
      owner_url: owner_url
    };
    sourceResponse = await dispatch(createSource<APISource>(owner_url, source));
    if (!sourceResponse) {
      dispatch(completeAction(CREATE_AND_ADD_LINKED_SOURCE_ACTION));
      return false;
    }
    sourceResponse = sourceResponse as APISource;

    let dictionaryResponse: APIDictionary | boolean;

    dispatch(
      progressAction(
        CREATE_AND_ADD_LINKED_SOURCE_ACTION,
        "Updating dictionary..."
      )
    );

    dictionaryResponse = await dispatch(
      editDictionaryAction<APIDictionary>(dictionaryUrl, {
        extras: { source: sourceResponse.url }
      })
    );
    if (!dictionaryResponse) {
      // todo handle cleanup
      dispatch(completeAction(CREATE_AND_ADD_LINKED_SOURCE_ACTION));
      return false;
    }

    invalidateCache(RETRIEVE_DICTIONARY_ACTION, dispatch);
    dispatch(completeAction(CREATE_AND_ADD_LINKED_SOURCE_ACTION));
  };
};
const editDictionaryAction = createActionThunk(
  EDIT_DICTIONARY_ACTION,
  api.update
);
export const retrieveDictionaryVersionsAction = createActionThunk(
  RETRIEVE_DICTIONARY_VERSIONS_ACTION,
  api.versions.retrieve
);
export const createDictionaryVersionAction = createActionThunk(
  CREATE_DICTIONARY_VERSION_ACTION,
  api.versions.create
);

export const editDictionaryVersionAction = createActionThunk(
  EDIT_DICTIONARY_VERSION_ACTION,
  api.versions.update
);

export const recursivelyAddConceptsToDictionaryAction = (
  dictionaryUrl: string,
  rawConcepts: (APIConcept | string)[],
  bulk: boolean = false,
  sourceUrl?: string
) => {
  return async (dispatch: Function, getState: Function) => {
    if (!!!sourceUrl && !!rawConcepts.find((c) => typeof c === "string")) {
      // eslint-disable-next-line no-throw-literal
      throw {
        message: "Cannot load string-only concepts without a source url",
      };
    }

    const concepts = rawConcepts.map((concept) =>
      typeof concept === "string"
        ? {
            id: concept,
            url: `${sourceUrl}concepts/${concept}/`,
            source_url: sourceUrl,
          }
        : concept
    );
    
    let inProgressList;
    const conceptOrConcepts =
      concepts.length > 1 ? `concepts (${concepts.length})` : "concept";
    const thisOrThese = concepts.length > 1 ? "these" : "this";
    const actionIndex =
      addConceptsToDictionaryProgressListSelector(getState())?.length || 0;
    const updateProgress = (message: string) => {
      const headerMessage = concepts.map(concept => concept.id).join(", ");

      inProgressList = `Adding ${conceptOrConcepts}: ${headerMessage}--${message}`;
      dispatch(
        progressAction(
          indexedAction(ADD_CONCEPTS_TO_DICTIONARY, actionIndex),
          `Adding ${conceptOrConcepts}: ${headerMessage}--${message}`
        )
      );
    };

    dispatch(
      startAction(indexedAction(ADD_CONCEPTS_TO_DICTIONARY, actionIndex))
    );
    
    const groupedConcepts = groupBy(concepts, "source_url");
    const referencesToAdd = flatten(
      await Promise.all(
        Object.entries(groupedConcepts).map(([source, concepts]) =>
          recursivelyFetchToConcepts(
            source,
            concepts.map((concept) => concept.id),
            updateProgress
          )
        )
      )
    );

    const importMeta: ImportMetaData = {
      dictionary: dictionaryUrl,
      dateTime: dayjs().toString()
    };

    createLocalStorageObject("notification");
    const index = addToLocalStorageObject(
      "notification",
      "inProgressList",
      inProgressList || ""
    );
    addToLocalStorageObject("notification", "loadingList", true);
    addToLocalStorageObject("notification", "erroredList", null);
    addToLocalStorageObject("notification", "successList", "");
    addToLocalStorageObject("notification", "importMetaDataList", importMeta);

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
      const successList = getState().dictionaries.addReferencesResults;
      if (successList?.length > 0) {
        updateLocalStorageArray({
          name: "notification",
          key: "successList",
          value: successList[successList.length - 1],
          index: index
        });
      }
    } catch (e) {
      updateLocalStorageArray({
        name: "notification",
        key: "erroredList",
        value: e.response?.data,
        index: index
      });
      dispatch({
        type: `${ADD_CONCEPTS_TO_DICTIONARY}_${FAILURE}`,
        actionIndex: actionIndex,
        payload: e.response?.data,
        meta: [dictionaryUrl, concepts, bulk]
      });
    }

    updateLocalStorageArray({
      name: "notification",
      key: "loadingList",
      value: false,
      index: index
    });
    dispatch(
      completeAction(indexedAction(ADD_CONCEPTS_TO_DICTIONARY, actionIndex))
    );
  };
};

export const removeReferencesFromDictionaryAction = createActionThunk(
  REMOVE_REFERENCES_FROM_DICTIONARY,
  api.references.delete
);

export const toggleShowVerifiedAction = () => {
  return (dispatch: Function) => dispatch({type: TOGGLE_SHOW_VERIFIED_ACTION});
};
