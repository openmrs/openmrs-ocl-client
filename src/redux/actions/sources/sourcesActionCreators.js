import { IS_FETCHING, CLEAR_SOURCES } from '../types';

export const isSuccess = (type, payload) => ({
  type,
  payload,
});

export const isErrored = (type, payload) => ({
  type,
  payload,
});

export const isFetching = payload => ({
  type: IS_FETCHING,
  payload,
});

export const clearSources = () => ({
  type: CLEAR_SOURCES,
  payload: [],
});
