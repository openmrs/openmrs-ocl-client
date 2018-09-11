import instance from '../../../config/axiosConfig';
import { isErrored, isFetching, isSuccess } from './sourcesActionCreators';
import { FETCH_SOURCES, SEARCH_SOURCES } from '../types';

// eslint-disable-next-line
export const fetchSources = (query = '', types = [], limit = 25, page = 1, sortAsc = 'bestmatch') => async dispatch => {
  dispatch(isFetching(true));
  let url = `sources/?q=${query}&limit=${limit}&page=${page}&verbose=true&sortAsc=bestmatch`;
  if (types.length >= 1) {
    const sourceType = types.join(',');
    url = `sources/?q=${query}&sourceType=${sourceType}&limit=${limit}&page=${page}&verbose=true&sortAsc=${sortAsc}`;
  }
  let actionType = FETCH_SOURCES;
  if (query) {
    actionType = SEARCH_SOURCES;
  }
  try {
    const response = await instance.get(url);
    dispatch(isSuccess(actionType, response.data, types));
    dispatch(isFetching(false));
  } catch (error) {
    dispatch(isErrored(actionType, error.response.data));
    dispatch(isFetching(false));
  }
};
