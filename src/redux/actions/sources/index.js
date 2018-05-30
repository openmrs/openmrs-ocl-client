import instance from '../../../config/axiosConfig';
import { isErrored, isFetching, isSuccess } from './sourcesActionCreators';

// eslint-disable-next-line
export const fetchSources = (
  query = '',
  types = [],
  limit = 25,
  page = 1,
  sort = 'sortAsc=bestmatch',
) => async (dispatch) => {
  dispatch(isFetching(true));
  let url = `sources/?q=${query}&limit=${limit}&page=${page}&verbose=true&${sort}`;
  if (types.length >= 1) {
    const sourceType = types.join(',');
    url = `sources/?q=${query}&sourceType=${sourceType}&limit=${limit}&page=${page}&verbose=true&${sort}`;
  }
  try {
    const response = await instance.get(url);
    dispatch(isSuccess(response.data));
    dispatch(isFetching(false));
  } catch (error) {
    if (error.response) {
      dispatch(isErrored(error.response.data));
      dispatch(isFetching(false));
    } else if (error.request) {
      dispatch(isErrored("Request can't be made"));
      dispatch(isFetching(false));
    }
  }
};
