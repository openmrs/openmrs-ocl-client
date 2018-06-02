import { FETCH_SOURCES, IS_FETCHING } from '../types';

export const isSuccess = payload => ({
  type: FETCH_SOURCES,
  payload,
});

export const isErrored = payload => ({
  type: FETCH_SOURCES,
  payload,
});

export const isFetching = payload => ({
  type: IS_FETCHING,
  payload,
});
