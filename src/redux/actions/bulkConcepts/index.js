import { notify } from 'react-notify-toast';
import instance from '../../../config/axiosConfig';
import { isSuccess, isErrored, isFetching } from '../globalActionCreators';
import { FETCH_CIEL_CONCEPTS, ADD_EXISTING_BULK_CONCEPTS } from '../types';

const fetchCielConcepts = () => async (dispatch) => {
  dispatch(isFetching(true));
  const url = 'orgs/CIEL/sources/CIEL/concepts/';
  try {
    const response = await instance.get(url);
    dispatch(isSuccess(response.data, FETCH_CIEL_CONCEPTS));
    dispatch(isFetching(false));
  } catch (error) {
    dispatch(isErrored(error.response.data, FETCH_CIEL_CONCEPTS));
    dispatch(isFetching(false));
  }
};
export default fetchCielConcepts;

export const addExistingBulkConcepts = data => async (dispatch) => {
  const typeName = localStorage.getItem('typeName');
  const dictionaryId = localStorage.getItem('dictionaryId');
  const userType = localStorage.getItem('type');
  const url = `${userType}/${typeName}/collections/${dictionaryId}/references/`;
  const payload = await instance.put(url, data);
  dispatch(isSuccess(payload.data, ADD_EXISTING_BULK_CONCEPTS));
  const justAddedConcepts = payload.data.filter(concept => concept.added).length;
  const alreadyAddedConcepts = payload.data.length - justAddedConcepts;
  notify.show(`Added ${justAddedConcepts} concept(s) skipped ${alreadyAddedConcepts} that were already added`, 'success', 3000);
};

