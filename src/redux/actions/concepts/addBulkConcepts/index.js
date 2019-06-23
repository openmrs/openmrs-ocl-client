import { notify } from 'react-notify-toast';
import { union, pull } from 'lodash';
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
  CLEAR_BULK_FILTERS,
} from '../../types';
import api from '../../../api';
import { MAPPINGS_RECURSION_DEPTH, removeDuplicates } from '../../../../components/dictionaryConcepts/components/helperFunction';
import { FILTER_TYPES } from '../../../../constants';

export const fetchFilteredConcepts = (source = 'CIEL', query = '', currentPage = 1, conceptLimit = 10) => async (
  dispatch,
  getState,
) => {
  dispatch(isFetching(true));
  const {
    bulkConcepts: { datatypeList, classList },
  } = getState();
  let url = `orgs/${source}/sources/${source}/concepts/?${query}&limit=${conceptLimit}&page=${currentPage}&verbose=true&includeMappings=1`;

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
  if (type === FILTER_TYPES.DATATYPE) {
    dispatch(isSuccess(item, ADD_TO_DATATYPE_LIST));
    return dispatch(fetchFilteredConcepts('CIEL', query, currentPage));
  }
  dispatch(isSuccess(item, ADD_TO_CLASS_LIST));
  return dispatch(fetchFilteredConcepts('CIEL', query, currentPage));
};

export const clearAllBulkFilters = (filterType, query, currentPage) => (dispatch) => {
  dispatch({ type: CLEAR_BULK_FILTERS, payload: filterType });
  dispatch(fetchFilteredConcepts('CIEL', query, currentPage));
};

export const previewConcept = id => (dispatch, getState) => {
  const {
    bulkConcepts: { bulkConcepts },
  } = getState();
  const payload = bulkConcepts.filter(item => item.id === id);
  return dispatch(isSuccess(payload[0], PREVIEW_CONCEPT));
};

export const recursivelyFetchConceptMappings = async (
  fromConceptCodes,
  levelsToCheck,
  fetchMappings = api.mappings.fetchFromPublicSources,
) => {
  const startingConceptMappings = await fetchMappings(fromConceptCodes.join(','));
  const mappingsList = [startingConceptMappings.data];
  for (let i = 0; i < levelsToCheck; i += 1) {
    const toConceptCodes = mappingsList[i].map(
      mapping => mapping.to_concept_code,
    );
    if (!toConceptCodes.length) break;
    const conceptMappings = await api.mappings.fetchFromPublicSources(toConceptCodes.join(','));
    mappingsList.push(conceptMappings.data);
  }
  const toConceptUrls = union(...mappingsList).map((mapping) => {
    return mapping.to_concept_url;
  });
  const filteredToConceptUrls = pull(toConceptUrls, null);
  return removeDuplicates(filteredToConceptUrls);
};

export const addConcept = (params, data, conceptName, id) => async (dispatch) => {
  dispatch(isFetching(true));
  const { type, typeName, collectionName } = params;
  const url = `${type}/${typeName}/collections/${collectionName}/references/?cascade=sourcemappings`;
  try {
    const referencesToAdd = await recursivelyFetchConceptMappings([id], MAPPINGS_RECURSION_DEPTH);
    data.data.expressions.push(...referencesToAdd);

    const payload = await instance.put(url, data);
    dispatch(isSuccess(payload.data, ADD_EXISTING_CONCEPTS));
    if (payload.data[0].added === true) {
      notify.show(`Just Added - ${conceptName}`, 'success', 3000);
    } else {
      notify.show(`${conceptName} already added`, 'error', 3000);
    }
  } catch (e) {
    notify.show(`Failed to add ${conceptName}. Please Retry`, 'error', 3000);
  }
  dispatch(isFetching(false));
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
