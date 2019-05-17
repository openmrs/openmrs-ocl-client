import { notify } from 'react-notify-toast';
import instance from '../../../../config/axiosConfig';
import { isFetching, isSuccess } from '../../globalActionCreators';
import {
  ADD_TO_DATATYPE_LIST,
  ADD_TO_CLASS_LIST,
  FETCH_FILTERED_CONCEPTS,
  PREVIEW_CONCEPT,
  ADD_EXISTING_CONCEPTS,
  SET_PERVIOUS_PAGE,
  SET_NEXT_PAGE,
  SET_CURRENT_PAGE,
} from '../../types';

export const fetchFilteredConcepts = (source = 'CIEL', query = '', currentPage = 1) => async (
  dispatch,
  getState,
) => {
  dispatch(isFetching(true));
  const {
    bulkConcepts: { datatypeList, classList },
  } = getState();
  let url = `orgs/${source}/sources/${source}/concepts/?${query}&limit=10&page=${currentPage}&verbose=true&includeMappings=1`;

  if (datatypeList.length > 0) {
    url = `${url}&datatype=${datatypeList.join(',')}`;
  }

  if (classList.length > 0) {
    url = `${url}&conceptClass=${classList.join(',')}`;
  }

  try {
    const response = await instance.get(url);
    dispatch(isSuccess(response.data, FETCH_FILTERED_CONCEPTS));
    dispatch(isFetching(false));
  } catch (error) {
    dispatch(isFetching(false));
    notify.show('An error occurred with your internet connection, please fix it and try reloading the page.', 'error', 3000);
  }
};

export const addToFilterList = (item, type, query, currentPage) => (dispatch) => {
  if (type === 'datatype') {
    dispatch(isSuccess(item, ADD_TO_DATATYPE_LIST));
    return dispatch(fetchFilteredConcepts('CIEL', query, currentPage));
  }
  dispatch(isSuccess(item, ADD_TO_CLASS_LIST));
  return dispatch(fetchFilteredConcepts('CIEL', query, currentPage));
};

export const previewConcept = id => (dispatch, getState) => {
  const {
    bulkConcepts: { bulkConcepts },
  } = getState();
  const payload = bulkConcepts.filter(item => item.id === id);
  return dispatch(isSuccess(payload[0], PREVIEW_CONCEPT));
};

export const addConcept = (params, data, conceptName) => async (dispatch) => {
  const { type, typeName, collectionName } = params;
  const url = `${type}/${typeName}/collections/${collectionName}/references/`;
  const payload = await instance.put(url, data);
  dispatch(isSuccess(payload.data, ADD_EXISTING_CONCEPTS));
  if (payload.data[0].added === true) {
    notify.show(`Just Added - ${conceptName}`, 'success', 3000);
  } else {
    notify.show(`${conceptName} already added`, 'error', 3000);
  }
};

export const setCurrentPage = currentPage => async (dispatch) => {
  dispatch(isSuccess(currentPage, SET_CURRENT_PAGE));
};

export const setNextPage = () => async (dispatch) => {
  dispatch(isSuccess(null, SET_NEXT_PAGE));
};

export const setPreviousPage = () => async (dispatch) => {
  dispatch(isSuccess(null, SET_PERVIOUS_PAGE));
};
