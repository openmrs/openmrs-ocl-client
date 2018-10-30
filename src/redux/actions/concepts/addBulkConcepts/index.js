import { notify } from 'react-notify-toast';
import instance from '../../../../config/axiosConfig';
import { isFetching, isSuccess } from '../../globalActionCreators';
import {
  FETCH_BULK_CONCEPTS,
  ADD_TO_DATATYPE_LIST,
  ADD_TO_CLASS_LIST,
  FETCH_FILTERED_CONCEPTS,
  PREVIEW_CONCEPT,
  ADD_EXISTING_CONCEPTS,
} from '../../types';

export const fetchBulkConcepts = (source = 'CIEL') => async (dispatch) => {
  const url = `orgs/${source}/sources/${source}/concepts/?limit=0&verbose=true`;
  dispatch(isFetching(true));
  try {
    const response = await instance.get(url);
    dispatch(isSuccess(response.data, FETCH_BULK_CONCEPTS));
    dispatch(isFetching(false));
  } catch (error) {
    dispatch(isFetching(false));
    notify.show('an error occurred, reload your browser', 'error', 3000);
  }
};

export const fetchFilteredConcepts = (source = 'CIEL', query = '') => async (
  dispatch,
  getState,
) => {
  dispatch(isFetching(true));
  const {
    bulkConcepts: { datatypeList, classList },
  } = getState();

  let url = `orgs/${source}/sources/${source}/concepts/?${query}&limit=0&verbose=true`;

  if (datatypeList.length > 0 && classList.length > 0) {
    url = `
      orgs/${source}/sources/${source}/concepts/?${query}
      &limit=0&verbose=true&datatype=${datatypeList.join(',')}&conceptClass=${classList.join(',')}
    `;
  }
  if (datatypeList.length > 0 && classList.length === 0) {
    url = `
      orgs/${source}/sources/${source}/concepts/?${query}
      &limit=0&verbose=true&datatype=${datatypeList.join(',')}
    `;
  }
  if (datatypeList.length === 0 && classList.length > 0) {
    url = `
      orgs/${source}/sources/${source}/concepts/?${query}
      &limit=0&verbose=true&conceptClass=${classList.join(',')}
    `;
  }

  try {
    const response = await instance.get(url);
    dispatch(isSuccess(response.data, FETCH_FILTERED_CONCEPTS));
    dispatch(isFetching(false));
  } catch (error) {
    dispatch(isFetching(false));
    notify.show('an error occurred, reload your browser', 'error', 3000);
  }
};

export const addToFilterList = (item, type, query) => (dispatch) => {
  if (type === 'datatype') {
    dispatch(isSuccess(item, ADD_TO_DATATYPE_LIST));
    return dispatch(fetchFilteredConcepts('CIEL', query));
  }
  dispatch(isSuccess(item, ADD_TO_CLASS_LIST));
  return dispatch(fetchFilteredConcepts('CIEL', query));
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
  }
  notify.show(`${conceptName} already added`, 'error', 3000);
};
