import * as types from '../types';
import * as action from '../globalActionCreators/index';
import instance from '../../../config/axiosConfig';

// eslint-disable-next-line
export const fetchDictionaryConcepts = (
  conceptType = 'users',
  conceptOwner = 'emasys',
  conceptName = 'dev-col',
  limit = 10,
  page = 1,
) => async (dispatch) => {
  dispatch(action.isFetching(true));
  const url = `${conceptType}/${conceptOwner}/collections/${conceptName}/concepts/?limit=${limit}&page=${page}&sortDesc=lastUpdate`;
  try {
    const response = await instance.get(url);
    dispatch(action.fetchDictionaryConcepts(response.data, types.FETCH_DICTIONARY_CONCEPT));
    dispatch(action.isFetching(false));
  } catch (error) {
    dispatch(action.isErrored(error.response.data));
    dispatch(action.isFetching(false));
  }
};
