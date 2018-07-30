import instance from '../../../config/axiosConfig';
import { isSuccess, isErrored, isFetching } from '../globalActionCreators';
import { FETCH_CIEL_CONCEPTS } from '../types';

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

