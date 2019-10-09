import { notify } from 'react-notify-toast';
import instance from '../../../config/axiosConfig';
import {
  isSuccess,
  isFetching,
  clear,
} from '../globalActionCreators';
import {
  ADD_EXISTING_BULK_CONCEPTS,
  FETCH_CONCEPT_SOURCES,
  CLEAR_SOURCE_CONCEPTS,
} from '../types';
import { recursivelyFetchConceptMappings } from '../concepts/addBulkConcepts';
import { MAPPINGS_RECURSION_DEPTH } from '../../../components/dictionaryConcepts/components/helperFunction';
import { deleteNotification, upsertNotification } from '../notifications';
import { ADDING_CONCEPTS_WARNING_MESSAGE } from '../../../constants';
import { checkErrorMessage } from '../../../helperFunctions';

export const addExistingBulkConcepts = conceptData => async (dispatch) => {
  const { url, data, conceptIdList: fromConceptIds } = conceptData;
  const updateNotification = message => dispatch(upsertNotification(
    `adding-${fromConceptIds}`, `Adding ${fromConceptIds}\n\n${message}${ADDING_CONCEPTS_WARNING_MESSAGE}`,
  ));

  try {
    const referencesToAdd = await recursivelyFetchConceptMappings(
      fromConceptIds, MAPPINGS_RECURSION_DEPTH, undefined, updateNotification,
    );
    data.data.expressions.push(...referencesToAdd);

    updateNotification(
      `Adding these and ${referencesToAdd.length} dependent concepts...`,
    );

    const payload = await instance.put(url, data);
    dispatch(isSuccess(payload.data, ADD_EXISTING_BULK_CONCEPTS));
    const results = payload.data.filter(result => result.expression.indexOf('/concepts/') !== -1);
    const existing = results.filter(pay => pay.added === false);
    if (existing.length > 0) {
      notify.show(`Only ${results.length - existing.length} of ${results.length} concept(s) were added. Skipped ${existing.length} already added`, 'error', 3000);
    } else {
      notify.show(`${results.length} Concept(s) Added`, 'success', 4000);
    }
  } catch (error) {
    const defaultMessage = 'Failed to add concepts. Please retry';
    checkErrorMessage(error, defaultMessage);
  } finally {
    dispatch(deleteNotification(`adding-${fromConceptIds}`));
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
    const defaultMessage = 'There was an error in referencing concepts in the new dictionary';
    return checkErrorMessage(error, defaultMessage);
  }
  return dispatch(isSuccess(payload, ADD_EXISTING_BULK_CONCEPTS));
};

export const fetchConceptSources = () => async (dispatch) => {
  dispatch(isFetching(true));
  dispatch(clear(CLEAR_SOURCE_CONCEPTS));
  try {
    const response = await instance.get('/sources/?limit=0&verbose=true');
    dispatch(isSuccess(response.data, FETCH_CONCEPT_SOURCES));
    dispatch(isFetching(false));
  } catch (error) {
    const defaultMessage = 'Failed to fetch source concepts';
    checkErrorMessage(error, defaultMessage);
    dispatch(isFetching(false));
  }
};
