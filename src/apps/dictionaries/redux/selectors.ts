import {
  AppState,
  errorListSelector,
  errorSelector,
  indexedAction,
  loadingListSelector,
  loadingSelector,
  progressListSelector,
  progressSelector
} from '../../../redux'
import { createSourceErrorSelector, editSourceErrorSelector } from '../../sources'
import { ORG_DICTIONARIES_ACTION_INDEX, PERSONAL_DICTIONARIES_ACTION_INDEX } from './constants'
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
} from './actionTypes'

export const createDictionaryLoadingSelector = loadingSelector(
  indexedAction(CREATE_SOURCE_AND_DICTIONARY_ACTION)
);
export const createDictionaryProgressSelector = progressSelector(
  indexedAction(CREATE_SOURCE_AND_DICTIONARY_ACTION)
);
export const createDictionaryErrorSelector = errorSelector(
  indexedAction(CREATE_DICTIONARY_ACTION)
);
export const editDictionaryErrorSelector = errorSelector(
  indexedAction(EDIT_DICTIONARY_ACTION)
);
export const editDictionaryLoadingSelector = loadingSelector(
  indexedAction(EDIT_SOURCE_AND_DICTIONARY_ACTION)
);
export const editDictionaryProgressSelector = progressSelector(
  indexedAction(EDIT_SOURCE_AND_DICTIONARY_ACTION)
);
export const createSourceAndDictionaryErrorsSelector = (
  state: AppState
): { [key: string]: string[] | undefined } | undefined => {
  const createSourceErrors = createSourceErrorSelector(state);
  if (createSourceErrors) return createSourceErrors;

  const createDictionaryErrors = createDictionaryErrorSelector(state);
  if (createDictionaryErrors) return createDictionaryErrors;
};
export const editSourceAndDictionaryErrorsSelector = (
  state: AppState
): { [key: string]: string[] | undefined } | undefined => {
  const editSourceErrors = editSourceErrorSelector(state);
  if (editSourceErrors) return editSourceErrors;

  const editDictionaryErrors = editDictionaryErrorSelector(state);
  if (editDictionaryErrors) return editDictionaryErrors;
};

export const retrieveDictionaryLoadingSelector = loadingSelector(
  indexedAction(RETRIEVE_DICTIONARY_ACTION)
);

export const retrieveDictionaryVersionLoadingSelector = loadingSelector(
  indexedAction(RETRIEVE_DICTIONARY_VERSIONS_ACTION)
);
export const createDictionaryVersionLoadingSelector = loadingSelector(
  indexedAction(CREATE_DICTIONARY_VERSION_ACTION)
);
export const createDictionaryVersionErrorSelector = errorSelector(
  indexedAction(CREATE_DICTIONARY_VERSION_ACTION)
);

export const retrievePublicDictionariesLoadingSelector = loadingSelector(
  indexedAction(RETRIEVE_DICTIONARIES_ACTION)
);
export const retrieveDictionariesLoadingSelector = loadingSelector(
  indexedAction(
    RETRIEVE_DICTIONARIES_ACTION,
    PERSONAL_DICTIONARIES_ACTION_INDEX
  ),
  indexedAction(RETRIEVE_DICTIONARIES_ACTION, ORG_DICTIONARIES_ACTION_INDEX)
);

export const addConceptsToDictionaryLoadingListSelector = loadingListSelector(
  ADD_CONCEPTS_TO_DICTIONARY
);
export const addConceptsToDictionaryProgressListSelector = progressListSelector(
  ADD_CONCEPTS_TO_DICTIONARY
);
export const addConceptsToDictionaryErrorListSelector = errorListSelector(
  ADD_CONCEPTS_TO_DICTIONARY
);
export const removeReferencesFromDictionaryLoadingSelector = loadingListSelector(REMOVE_REFERENCES_FROM_DICTIONARY);
