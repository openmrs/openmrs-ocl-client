import { ADDING_DICTIONARY, FETCHING_ORGANIZATIONS, ADDING_DICTIONARY_FAILURE, FETCHING_DICTIONARIES, IS_FETCHING, CLEAR_DICTIONARIES, FETCHING_DICTIONARY, CLEAR_DICTIONARY, FETCH_DICTIONARY_CONCEPT } from './../types';

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
