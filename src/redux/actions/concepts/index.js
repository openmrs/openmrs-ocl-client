import instance from '../../../config/axiosConfig';

import { isErrored, fetchConcepts, isFetching } from './ConceptActionCreators';

const fetchConceptsAction = (
  query = '',
  names = [],
  limit = 500,
  page = 1,
) => async (dispatch) => {
  dispatch(isFetching(true));
  let url = `concepts/?q=${query}&limit=${limit}&page=${page}&verbose=true`;
  if (names.length >= 1) {
    const displayName = names.join(',');
    url = `concepts/?q=${query}&displayName=${displayName}&limit=${limit}&page=${page}&verbose=true`;
  }
  try {
    const response = await instance.get(url);
    dispatch(fetchConcepts(response.data));
    dispatch(isFetching(false));
  } catch (error) {
    dispatch(isFetching(false));
    if (error.response) {
      dispatch(isErrored(error.response.data));
      dispatch(isFetching(false));
    } else if (error.request) {
      dispatch(isErrored("Request can't be made"));
      dispatch(isFetching(false));
    }
  }
};
export default fetchConceptsAction;
