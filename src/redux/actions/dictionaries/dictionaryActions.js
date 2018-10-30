import {
  ADDING_DICTIONARY,
  FETCHING_ORGANIZATIONS,
  ADDING_DICTIONARY_FAILURE,
  FETCHING_DICTIONARIES,
  IS_FETCHING,
  CLEAR_DICTIONARIES,
  FETCHING_DICTIONARY,
  CLEAR_DICTIONARY,
  FETCHING_VERSIONS,
  FETCH_DICTIONARY_CONCEPT,
  EDIT_DICTIONARY_SUCCESS,
  REMOVE_CONCEPT,
  CREATING_RELEASED_VERSION,
  CREATING_RELEASED_VERSION_FAILED,
  RELEASING_HEAD_VERSION,
} from '../types';

export const addDictionary = response => ({
  type: ADDING_DICTIONARY,
  payload: response.data,
});

export const fetchOrganizations = response => ({
  type: FETCHING_ORGANIZATIONS,
  payload: response,
});

export const addDictionaryFailure = response => ({
  type: ADDING_DICTIONARY_FAILURE,
  payload: response,
});

export const isSuccess = payload => ({
  type: FETCHING_DICTIONARIES,
  payload,
});

export const isErrored = payload => ({
  type: FETCHING_DICTIONARIES,
  payload,
});

export const isFetching = payload => ({
  type: IS_FETCHING,
  payload,
});

export const clearDictionaries = () => ({
  type: CLEAR_DICTIONARIES,
  payload: [],
});

export const dictionaryIsSuccess = payload => ({
  type: FETCHING_DICTIONARY,
  payload,
});

export const dictionaryConceptsIsSuccess = payload => ({
  type: FETCH_DICTIONARY_CONCEPT,
  payload,
});

export const clearDictionary = () => ({
  type: CLEAR_DICTIONARY,
  payload: {},
});

export const removeConcept = payload => ({
  type: REMOVE_CONCEPT,
  payload,
});

export const fetchingVersions = payload => ({
  type: FETCHING_VERSIONS,
  payload,
});

export const realisingHeadSuccess = payload => ({
  type: RELEASING_HEAD_VERSION,
  payload,
});

export const editDictionarySuccess = response => ({
  type: EDIT_DICTIONARY_SUCCESS,
  payload: response,
});

export const creatingVersionsSuccess = payload => ({
  type: CREATING_RELEASED_VERSION,
  payload,
});

export const creatingVersionsError = payload => ({
  type: CREATING_RELEASED_VERSION_FAILED,
  payload,
});
