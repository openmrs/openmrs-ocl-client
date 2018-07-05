import {
  POPULATE_SIDEBAR,
  FILTER_BY_SOURCES,
  FILTER_BY_CLASS,
  FETCH_DICTIONARY_CONCEPT,
} from '../types';
import { isFetching, getDictionaryConcepts, isErrored } from '../globalActionCreators/index';
import instance from '../../../config/axiosConfig';

export const populateSidenav = () => (dispatch, getState) => {
  const payload = getState().concepts.dictionaryConcepts;
  dispatch({ type: POPULATE_SIDEBAR, payload });
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
      dispatch(isErrored(error.response.data));
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
