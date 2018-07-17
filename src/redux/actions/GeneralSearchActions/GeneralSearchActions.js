import { SEARCH_RESULTS, IS_FETCHING } from '../types';

export const searchResults = payload => ({
  type: SEARCH_RESULTS,
  payload,
});

export const isFetching = payload => ({
  type: IS_FETCHING,
  payload,
});

