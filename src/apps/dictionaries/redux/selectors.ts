import {
  AppState,
  errorListSelector,
  indexedAction,
  loadingListSelector,
  loadingSelector,
  progressListSelector,
  progressSelector
} from '../../../redux'
import { createSourceErrorSelector, editSourceErrorSelector } from '../../sources'
import { errorSelector } from '../../../redux/redux'
import { ORG_DICTIONARIES_ACTION_INDEX, PERSONAL_DICTIONARIES_ACTION_INDEX } from './constants'
import {
  ADD_CONCEPTS_TO_COLLECTION,
  CREATE_DICTIONARY_ACTION,
  CREATE_SOURCE_COLLECTION_DICTIONARY_ACTION,
  EDIT_DICTIONARY_ACTION,
  EDIT_SOURCE_COLLECTION_DICTIONARY_ACTION, RETRIEVE_DICTIONARIES_ACTION, RETRIEVE_DICTIONARY_ACTION,
  RETRIEVE_DICTIONARY_VERSIONS_ACTION
} from './actionTypes'

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

const addConceptsToCollectionLoadingListSelector = loadingListSelector(
  ADD_CONCEPTS_TO_COLLECTION
)
const addConceptsToCollectionProgressListSelector = progressListSelector(
  ADD_CONCEPTS_TO_COLLECTION
)
const addConceptsToCollectionErrorListSelector = errorListSelector(
  ADD_CONCEPTS_TO_COLLECTION
)
export {
  addConceptsToCollectionErrorListSelector,
  addConceptsToCollectionProgressListSelector,
  addConceptsToCollectionLoadingListSelector,
  createDictionaryLoadingSelector,
  createDictionaryProgressSelector,
  createSourceCollectionDictionaryErrorsSelector,
  retrieveDictionaryLoadingSelector,
  retrievePublicDictionariesLoadingSelector,
  retrieveDictionariesLoadingSelector,
  editSourceCollectionDictionaryErrorsSelector,
  editDictionaryProgressSelector,
  editDictionaryLoadingSelector,
  retrieveDictionaryVersionLoadingSelector,
}
