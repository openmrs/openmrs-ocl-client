import uuid from 'uuid/v4';
import { notify } from 'react-notify-toast';

import {
  POPULATE_SIDEBAR,
  FILTER_BY_SOURCES,
  FILTER_BY_CLASS,
  FETCH_DICTIONARY_CONCEPT,
  CREATE_NEW_NAMES,
  REMOVE_ONE_NAME,
  ADD_NEW_DESCRIPTION,
  REMOVE_ONE_DESCRIPTION,
  CLEAR_FORM_SELECTIONS,
  CREATE_NEW_CONCEPT,
  ADD_CONCEPT_TO_DICTIONARY,
} from '../types';
import {
  isFetching,
  getDictionaryConcepts,
  isErrored,
  isSuccess,
} from '../globalActionCreators/index';
import instance from '../../../config/axiosConfig';

export const populateSidenav = () => (dispatch, getState) => {
  const payload = getState().concepts.dictionaryConcepts;
  dispatch({ type: POPULATE_SIDEBAR, payload });
};

export const createNewName = () => (dispatch) => {
  const payload = uuid();
  dispatch({ type: CREATE_NEW_NAMES, payload });
};

export const removeNewName = id => (dispatch) => {
  const payload = id;
  dispatch({ type: REMOVE_ONE_NAME, payload });
};

export const addNewDescription = () => (dispatch) => {
  const payload = uuid();
  dispatch({ type: ADD_NEW_DESCRIPTION, payload });
};

export const removeDescription = id => (dispatch) => {
  const payload = id;
  dispatch({ type: REMOVE_ONE_DESCRIPTION, payload });
};

export const clearSelections = () => (dispatch) => {
  dispatch({ type: CLEAR_FORM_SELECTIONS, payload: [] });
};

/* eslint-disable */
export const fetchDictionaryConcepts = (
  conceptType = 'users',
  conceptOwner = 'emasys',
  conceptName = 'dev-col',
  query = '',
  filterType = null,
  limit = 10,
  page = 1,
) => async (dispatch, getState) => {
  dispatch(isFetching(true));
  let url = `${conceptType}/${conceptOwner}/collections/${conceptName}/concepts/?q=${query}&limit=${limit}&page=${page}&sortDesc=lastUpdate`;
  const filterBySource = getState().concepts.filteredBySource;
  const filterByClass = getState().concepts.filteredByClass;

  if (filterBySource.length > 0 && filterByClass.length > 0) {
    url = `${conceptType}/${conceptOwner}/collections/${conceptName}/concepts/?q=${query}&limit=${limit}&page=${page}&sortDesc=lastUpdate&source=${filterBySource.join(
      ',',
    )}&conceptClass=${filterByClass.join(',')}`;
  }
  if (filterBySource.length > 0 && filterByClass.length === 0) {
    url = `${conceptType}/${conceptOwner}/collections/${conceptName}/concepts/?q=${query}&limit=${limit}&page=${page}&sortDesc=lastUpdate&source=${filterBySource.join(
      ',',
    )}`;
  }
  if (filterBySource.length === 0 && filterByClass.length > 0) {
    url = `${conceptType}/${conceptOwner}/collections/${conceptName}/concepts/?q=${query}&limit=${limit}&page=${page}&sortDesc=lastUpdate&conceptClass=${filterByClass.join(
      ',',
    )}`;
  }
  try {
    const response = await instance.get(url);
    dispatch(getDictionaryConcepts(response.data, FETCH_DICTIONARY_CONCEPT));
    dispatch(isFetching(false));
    if (query === '' && filterByClass.length === 0 && filterBySource.length === 0) {
      dispatch(populateSidenav());
    }
  } catch (error) {
    if (error.response) {
      dispatch(isErrored(error.response.data, FETCH_DICTIONARY_CONCEPT));
      dispatch(isFetching(false));
    }
  }
};

export const filterBySource = (
  keyword,
  conceptType,
  conceptOwner,
  conceptName,
  filterType,
  query = '',
) => dispatch => {
  dispatch({ type: FILTER_BY_SOURCES, payload: keyword });
  dispatch(fetchDictionaryConcepts(conceptType, conceptOwner, conceptName, query, filterType));
};

export const filterByClass = (
  keyword,
  conceptType,
  conceptOwner,
  conceptName,
  filterType,
  query = '',
) => dispatch => {
  dispatch({ type: FILTER_BY_CLASS, payload: keyword });
  dispatch(fetchDictionaryConcepts(conceptType, conceptOwner, conceptName, query, filterType));
};

export const createNewConcept = (data, dataUrl) => async dispatch => {
  dispatch(isFetching(true));
  let url = dataUrl;
  try {
    const response = await instance.post(url, data);
    dispatch(isSuccess(response.data, CREATE_NEW_CONCEPT));
    dispatch(addConceptToDictionary(response.data.id, dataUrl));
    notify.show('concept successfully created', 'success', 3000);
  } catch (error) {
    notify.show('concept could not be created', 'error', 3000);
    if (error.response) {
      dispatch(isErrored(error.response.data, CREATE_NEW_CONCEPT));
      dispatch(isFetching(false));
    }
  }
};

export const addConceptToDictionary = (id, dataUrl) => async dispatch => {
  const newConcept = `${dataUrl}${id}/`;
  const urlConstruct = dataUrl.split('/');
  const userType = urlConstruct[1];
  const sourceName = urlConstruct[4];
  const username = urlConstruct[2];
  const data = { data: { expressions: [newConcept] } };
  const url = `${userType}/${username}/collections/${sourceName}/references/`;
  try {
    const response = await instance.put(url, data);
    dispatch(isSuccess(response.data, ADD_CONCEPT_TO_DICTIONARY));
    dispatch(isFetching(false));
    notify.show('concept successfully created', 'success', 3000);
  } catch (error) {
    notify.show('an error occurred', 'error', 3000);
  }
};
