import { ADDING_DICTIONARY, FETCHING_ORGANIZATIONS, ADDING_DICTIONARY_FAILURE } from './../types';

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
