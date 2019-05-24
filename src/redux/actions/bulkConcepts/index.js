import { notify } from 'react-notify-toast';
import instance from '../../../config/axiosConfig';
import {
  isSuccess,
  isErrored,
  isFetching,
  clear,
} from '../globalActionCreators';
import {
  FETCH_SOURCE_CONCEPTS,
  ADD_EXISTING_BULK_CONCEPTS,
  FETCH_CONCEPT_SOURCES,
  CLEAR_SOURCE_CONCEPTS,
  IS_LOADING,
} from '../types';
import { recursivelyFetchConceptMappings } from '../concepts/addBulkConcepts';
import { MAPPINGS_RECURSION_DEPTH } from '../../../components/dictionaryConcepts/components/helperFunction';

const fetchSourceConcepts = url => async (dispatch) => {
  dispatch(clear(CLEAR_SOURCE_CONCEPTS));
  dispatch(isSuccess(true, IS_LOADING));
  try {
    const response = await instance.get(`${url}concepts/?limit=0`);
    dispatch(isSuccess(response.data, FETCH_SOURCE_CONCEPTS));
    dispatch(isSuccess(false, IS_LOADING));
  } catch (error) {
    dispatch(isErrored(error.response.data, FETCH_SOURCE_CONCEPTS));
    dispatch(isSuccess(false, IS_LOADING));
  }
};
export default fetchSourceConcepts;

export const addExistingBulkConcepts = conceptData => async (dispatch) => {
  const { url, data, conceptIdList: fromConceptIds } = conceptData;
  try {
    const referencesToAdd = await recursivelyFetchConceptMappings(
      fromConceptIds, MAPPINGS_RECURSION_DEPTH,
    );
    data.data.expressions.push(...referencesToAdd);

    const payload = await instance.put(url, data);
    dispatch(isSuccess(payload.data, ADD_EXISTING_BULK_CONCEPTS));
    const existing = payload.data.filter(pay => pay.added === false);
    if (existing.length > 0) {
      notify.show(`Only ${payload.data.length - existing.length} of ${payload.data.length} concept(s) were added. Skipped ${existing.length} already added`, 'error', 3000);
    } else {
      notify.show(`${payload.data.length} Concept(s) Added`, 'success', 4000);
    }
  } catch (error) {
    if (error && error.response) {
      notify.show(error.response.data.detail, 'error', 3000);
    } else {
      notify.show('Failed to add concepts. Please retry', 'error', 3000);
    }
  }
};

export const isConceptValid = async ({ url }) => {
  try {
    const payload = await instance.get(url);
    return payload.data.retired ? [false, 'retired'] : [true];
  } catch (error) {
    return [false, 'does not exist'];
  }
};

export const addDictionaryReference = (conceptUrl, ownerUrl, dictionaryId) => async (dispatch) => {
  const url = `${ownerUrl}collections/${dictionaryId}/references/`;
  let payload;
  try {
    const conceptsResponse = await instance.get(conceptUrl);
    const references = {
      data: { expressions: [...conceptsResponse.data.map(concept => concept.url)] },
    };
    payload = await instance.put(url, references);
  } catch (error) {
    return notify.show(
      'There was an error in referencing concepts in the new dictionary', 'error', 3000,
    );
  }
  return dispatch(isSuccess(payload, ADD_EXISTING_BULK_CONCEPTS));
};

export const fetchConceptSources = () => async (dispatch) => {
  dispatch(isFetching(true));
  dispatch(clear(CLEAR_SOURCE_CONCEPTS));
  try {
    const response = await instance.get('/sources/?limit=0');
    dispatch(isSuccess(response.data, FETCH_CONCEPT_SOURCES));
    dispatch(isFetching(false));
  } catch (error) {
    dispatch(isErrored(error.response.data, FETCH_CONCEPT_SOURCES));
    dispatch(isFetching(false));
  }
};
